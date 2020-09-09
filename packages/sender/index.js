require("dotenv").config();
var Client = require("castv2").Client;
var mdns = require("mdns");
const uuid = require("uuid").v4;

var browser = mdns.createBrowser(mdns.tcp("googlecast"));

browser.on("serviceUp", function (service) {
  console.log(
    "found device %s at %s:%d",
    service.name,
    service.addresses[0],
    service.port
  );
  ondeviceup(service.addresses[0]);
  browser.stop();
});

browser.start();

const CONFIG_CHANNEL = "urn:x-cast:me.caille.nova.sofia.config";
const clientId = `client-${uuid()}`;

function ondeviceup(host) {
  var client = new Client();
  client.connect(host, function () {
    // create various namespace handlers
    var connection = client.createChannel(
      "sender-0",
      "receiver-0",
      "urn:x-cast:com.google.cast.tp.connection",
      "JSON"
    );
    var heartbeat = client.createChannel(
      "sender-0",
      "receiver-0",
      "urn:x-cast:com.google.cast.tp.heartbeat",
      "JSON"
    );
    var receiver = client.createChannel(
      "sender-0",
      "receiver-0",
      "urn:x-cast:com.google.cast.receiver",
      "JSON"
    );

    var transportId = null;

    const createCustomChannel = (id) => {
      console.log("CREATE CUSTOM");
      transportId = id;
      const mySenderConnection = client.createChannel(
        clientId,
        transportId,
        "urn:x-cast:com.google.cast.tp.connection",
        "JSON"
      );
      mySenderConnection.send({ type: "CONNECT" });
      var config = client.createChannel(
        clientId,
        transportId,
        CONFIG_CHANNEL,
        "JSON"
      );
      config.send({
        type: "CONFIG",
        config: { mqttUrl: process.env.MQTT_URL },
      });

      setInterval(function () {
        config.send({
          type: "KEEPALIVE",
        });
      }, 5000);
    };

    // establish virtual connection to the receiver
    connection.send({ type: "CONNECT" });

    // start heartbeating
    setInterval(function () {
      heartbeat.send({ type: "PING" });
    }, 5000);

    // launch YouTube app
    receiver.send({ type: "LAUNCH", appId: "844DF153", requestId: 1 });

    // display receiver status updates
    receiver.on("message", function (data, broadcast) {
      if (data.type === "RECEIVER_STATUS" && data.status.applications) {
        createCustomChannel(data.status.applications[0].transportId);
      }
    });
  });
}
