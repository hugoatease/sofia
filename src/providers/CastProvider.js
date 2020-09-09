import React, { useRef, useState, useEffect } from "react";
import { useMount } from "react-use";
import { CastContext } from "contexts";

const CONFIG_CHANNEL = "urn:x-cast:me.caille.nova.sofia.config";

const CastProvider = ({ children }) => {
  const castInstance = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [config, setConfig] = useState();

  useMount(() => {
    castInstance.current = window.cast.framework.CastReceiverContext.getInstance();
    const castDebugLogger = window.cast.debug.CastDebugLogger.getInstance();
    // castDebugLogger.setEnabled(true);
    // castDebugLogger.showDebugLogs(true);
    castDebugLogger.loggerLevelByEvents = {
      "cast.framework.events.category.CORE":
        window.cast.framework.LoggerLevel.INFO,
      "cast.framework.events.EventType.MEDIA_STATUS":
        window.cast.framework.LoggerLevel.DEBUG,
      sofia: window.cast.framework.LoggerLevel.DEBUG,
    };
    setIsReady(true);
  });

  const castDebugLogger = window.cast.debug.CastDebugLogger.getInstance();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    try {
      castInstance.current.addCustomMessageListener(CONFIG_CHANNEL, (event) => {
        castDebugLogger.info("event", JSON.stringify(event));
        castDebugLogger.info("event state", JSON.stringify(event.state));
        castDebugLogger.info("event data", JSON.stringify(event.data));
        castDebugLogger.info(
          "event data config",
          JSON.stringify(event.data.config)
        );
        setConfig(event.data.config);
      });
      castDebugLogger.info("sofia", "added config listener");
    } catch (err) {
      castDebugLogger.error("sofia", err);
    }

    const options = new window.cast.framework.CastReceiverOptions();
    options.customNamespaces = {
      [CONFIG_CHANNEL]: window.cast.framework.system.MessageType.JSON,
    };
    castInstance.current.start(options);
  }, [isReady, castDebugLogger]);

  castDebugLogger.info("sofia", `CONFIG : ${JSON.stringify(config)}`);

  return (
    <CastContext.Provider
      value={{ isReady, castInstance: castInstance.current, config }}
    >
      {children}
    </CastContext.Provider>
  );
};

export default CastProvider;
