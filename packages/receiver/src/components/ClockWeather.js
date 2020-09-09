import React, { useState } from "react";
import styled from "styled-components";
import { rhythm, scale } from "ui";
import { useHarmonicIntervalFn } from "react-use";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ClockWeatherWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: ${rhythm(0.5)};
  ${scale(1)};
`;

const Clock = styled.div`
  font-family: "Roboto Mono";
`;

const ClockWeather = () => {
  const [time, setTime] = useState(new Date());
  useHarmonicIntervalFn(() => {
    setTime(new Date());
  }, 1000);
  return (
    <ClockWeatherWrapper>
      <div style={scale(0.5)}>
        {format(time, "cccc d MMMM", { locale: fr })}
      </div>
      <Clock>{format(time, "HH:mm")}</Clock>
    </ClockWeatherWrapper>
  );
};

export default ClockWeather;
