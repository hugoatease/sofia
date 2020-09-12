import React, { useContext } from "react";
import { MQTTProvider } from "react-mqtt";
import { createGlobalStyle } from "styled-components";
import { CastContext } from "contexts";
import { Widgets, Layout } from "ui";
import CurrentlyPlaying from "components/CurrentlyPlaying";
import Background from "components/Background";
import ClockWeather from "components/ClockWeather";
import Footer from "components/Footer";

const MQTT_URL = process.env.REACT_APP_MQTT_URL;

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arimo, sans-serif;
    background-color: #fff;
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
      <Background />
      <Layout>
        <CurrentlyPlaying style={{ gridRow: 1 }} />
        <Widgets style={{ gridRow: 1 }}>
          <ClockWeather />
        </Widgets>
      </Layout>
      <Footer />
    </MQTTProvider>
  );
}

export default App;
