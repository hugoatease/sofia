import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { rhythm, scale } from "ui";
import { useHarmonicIntervalFn } from "react-use";
import axios from "axios";
import useSwr from "swr";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useConfig } from "hooks";
import "weather-icons-sass/css/weather-icons.css";

const ClockWeatherWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: ${rhythm(0.5)};
  ${scale(1)};

  i {
    margin-right: ${rhythm(1 / 4)};
  }
`;

const Clock = styled.div`
  font-family: "Roboto Mono";
`;

const CurrentWeather = styled.div`
  ${scale(0.5)};
`;

const ClockWeather = () => {
  const config = useConfig();
  const [time, setTime] = useState(new Date());

  const fetchWeather = useCallback(() => {
    if (!config.weatherLat || !config.weatherLon) {
      return null;
    }
    return axios
      .get("https://api.openweathermap.org/data/2.5/onecall", {
        params: {
          appid: config.owmKey,
          lat: config.weatherLat,
          lon: config.weatherLon,
          exclude: "daily,minute",
          units: "metric",
        },
      })
      .then(({ data }) => data);
  }, [config]);

  const { data: weatherData } = useSwr("weather", fetchWeather, {
    refreshInterval: 20 * 60 * 1000,
  });

  useHarmonicIntervalFn(() => {
    setTime(new Date());
  }, 1000);

  return (
    <ClockWeatherWrapper>
      <div>
        <div style={scale(0.5)}>
          {format(time, "cccc d MMMM", { locale: fr })}
        </div>
        <Clock>{format(time, "HH:mm")}</Clock>
      </div>
      <CurrentWeather>
        <i className={`wi wi-owm-${weatherData?.current?.weather?.[0]?.id}`} />
        {Math.floor(weatherData?.current?.temp)} °C
      </CurrentWeather>
    </ClockWeatherWrapper>
  );
};

export default ClockWeather;
