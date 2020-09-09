import React, { useState } from "react";
import { createGlobalStyle } from "styled-components";
import { useInterval } from "react-use";

const BackgroundStyle = createGlobalStyle`
  body {
    background-image: url("${(props) => props.image}");
  }
`;

const Background = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useInterval(() => {
    setLastUpdate(new Date());
  }, 60000);

  return (
    <BackgroundStyle
      image={`https://source.unsplash.com/1920x1080/?abstract&${lastUpdate.getTime()}`}
    />
  );
};

export default Background;
