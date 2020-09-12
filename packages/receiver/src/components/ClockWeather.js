import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { rhythm, scale, Widget } from "ui";
import { useHarmonicIntervalFn } from "react-use";
import axios from "axios";
import useSwr from "swr";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useConfig } from "hooks";
import "weather-icons-sass/css/weather-icons.css";

const ClockWeatherWrapper = styled(Widget)`
  font-family: "Roboto Mono";
`;

const Clock = styled.div``;

const CurrentWeather = styled.div`
  ${scale(1)};
  i {
    margin-right: ${rhythm(1 / 4)};
  }
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HourlyForecast = styled(Widget)`
  font-family: "Roboto Mono";
  display: flex;
  justify-content: space-between;
`;

const ForecastItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${rhythm(1 / 4)};
  ${scale(0.25)};

  i {
    ${scale(1)};
  }
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

  const getIconName = ({ dt, weather }) => {
    const { sunset, sunrise } = weatherData?.current || {};

    if (dt > sunset && dt < sunrise + 24 * 3600) {
      return `wi wi-owm-night-${weather?.[0]?.id}`;
    }
    return `wi wi-owm-day-${weather?.[0]?.id}`;
  };

  return (
    <>
      <ClockWeatherWrapper>
        <Line>
          <Clock>{format(time, "HH:mm")}</Clock>
          <CurrentWeather>
            <i
              className={getIconName({
                dt: weatherData?.current?.dt,
                weather: weatherData?.current?.weather,
              })}
            />
            {Math.floor(weatherData?.current?.temp)}°C
          </CurrentWeather>
        </Line>
        <Line>
          <div style={scale(0.5)}>
            {format(time, "cccc d MMMM", { locale: fr })}
          </div>
        </Line>
      </ClockWeatherWrapper>
      <HourlyForecast>
        {(weatherData?.hourly || []).slice(1, 13).map(({ dt, weather }) => (
          <ForecastItem>
            <i className={getIconName({ dt, weather })} />
            {format(dt * 1000, "H")}h
          </ForecastItem>
        ))}
      </HourlyForecast>
    </>
  );
};

export default ClockWeather;
