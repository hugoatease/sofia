#!/usr/bin/env node
const mqtt = require("mqtt");
const yargs = require("yargs");
const MQTTPattern = require("mqtt-pattern");
var Client = require("castv2").Client;
const dnssd = require("dnssd");
const uuid = require("uuid").v4;

const argv = yargs.options({
  "mqtt-url": {
    describe: "MQTT connection URL",
    demandOption: true,
  },
  "mqtt-prefix": {
    default: "sofia",
  },
}).argv;

const FUNCTION_PATTERN = `${argv.mqttPrefix}/+function/#`;
const TOPIC_PATTERN_SET = `${argv.mqttPrefix}/set/+service`;
const CONFIG_CHANNEL = "urn:x-cast:me.caille.nova.sofia.config";

const mqttClient = mqtt.connect(argv.mqttUrl);
const clientId = `client-${uuid()}`;
const services = {};

const browser = dnssd.Browser(dnssd.tcp("googlecast"));
browser.on("serviceUp", (service) => {
  console.log(
    "found device %s at %s:%d",
    service.name,
    service.addresses[0],
    service.port
  );
  services[service.name] = service;
  mqttClient.publish(
    `${argv.mqttPrefix}/status/discovery/${service.name}`,
    JSON.stringify(service)
  );
});
browser.start();

const startDevice = (host) => {
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

    // establish virtual connection to the receiver
    connection.send({ type: "CONNECT" });

    // start heartbeating
    const interval = setInterval(function () {
      heartbeat.send({ type: "PING" });
    }, 5000);

    const createCustomChannel = (id) => {
      console.log("Sending configuration");
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
        config: { mqttUrl: argv.mqttUrl },
      });
      config.on("message", (data) => {
        if (data.type === "CONFIGURED") {
          clearInterval(interval);
          receiver.close();
          heartbeat.close();
          connection.close();
          client.close();
        }
      });
    };

    receiver.send({ type: "LAUNCH", appId: "844DF153", requestId: 1 });

    // display receiver status updates
    receiver.on("message", function (data, broadcast) {
      if (data.type === "RECEIVER_STATUS" && data.status.applications) {
        createCustomChannel(data.status.applications[0].transportId);
      }
    });
  });
};

const handleSetMessage = async (topic, message) => {
  const params = MQTTPattern.exec(TOPIC_PATTERN_SET, topic);
  if (!params) {
    return;
  }

  const { service: serviceName } = params;
  const service = services[serviceName];
  console.log("Starting ", serviceName);
  startDevice(service.addresses[0]);
};

const handleMessage = (topic, ...params) => {
  const parsedTopic = MQTTPattern.exec(FUNCTION_PATTERN, topic);
  if (!parsedTopic) {
    return;
  }

  switch (parsedTopic.function) {
    case "set":
      return handleSetMessage(topic, ...params);
    default:
      return null;
  }
};

mqttClient.on("message", handleMessage);
mqttClient.subscribe(`${argv.mqttPrefix}/set/#`);
