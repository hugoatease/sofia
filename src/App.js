import React, { useContext } from "react";
import { MQTTProvider } from "react-mqtt";
import { createGlobalStyle } from "styled-components";
import CurrentlyPlaying from "components/CurrentlyPlaying";
import { CastContext } from "contexts";

const MQTT_URL = process.env.REACT_APP_MQTT_URL;

const GlobalStyle = createGlobalStyle`
  body {
    background: url("https://images.unsplash.com/photo-1599366611308-719895c34512?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb");
    width: 1280px;
    height: 720px;
    overflow: hidden;
  }
`;

function App() {
  const { config } = useContext(CastContext);
  if (!config?.mqttUrl && !MQTT_URL) {
    return (
      <>
        <GlobalStyle />
        <div>Waiting for configuration</div>
      </>
    );
  }

  return (
    <MQTTProvider url={config?.mqttUrl || MQTT_URL}>
      <GlobalStyle />
      Hello
      <CurrentlyPlaying />
    </MQTTProvider>
  );
}

export default App;
