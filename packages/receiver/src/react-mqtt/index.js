import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import mqtt from "mqtt";
import MQTTPattern from "mqtt-pattern";

const MQTTContext = createContext({});

export const MQTTProvider = ({ url, children }) => {
  const clientRef = useRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!url) {
      return;
    }
    clientRef.current = mqtt.connect(url);
    setIsReady(true);
  }, [url]);

  return (
    <MQTTContext.Provider value={{ isReady, client: clientRef.current }}>
      {children}
    </MQTTContext.Provider>
  );
};

export const useTopic = ({ topic: pattern, onMessage }) => {
  const { client, isReady } = useContext(MQTTContext);

  const handleMessage = useCallback(
    (topic, payload) => {
      const params = MQTTPattern.exec(pattern, topic);
      if (params === null) {
        return;
      }
      onMessage({ topic, params, payload });
    },
    [pattern, onMessage]
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    client.on("message", handleMessage);
    client.subscribe(pattern);

    return () => {
      client.off("message", handleMessage);
      client.unsubscribe(pattern);
    };
  }, [isReady, client, pattern, handleMessage]);
};
