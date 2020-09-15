import React, { useState } from "react";
import styled from "styled-components";
import { useTopic } from "react-mqtt";
import { rhythm, scale } from "ui";

const Listen = styled.div`
  position: relative;
  background-image: url("${({ image }) => image}");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const ListenInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: ${rhythm()};
`;

const CurrentlyPlaying = ({ style }) => {
  const [listen, setListen] = useState();

  const handleMessage = ({ payload }) => {
    const data = JSON.parse(payload);
    setListen(data);
  };
  useTopic({ topic: "garfunkel/status/hugoatease", onMessage: handleMessage });

  if (!listen) {
    return null;
  }

  return (
    <Listen image={listen.ImageURL} style={style}>
      <ListenInfo>
        <div style={scale(2)}>{listen.TrackName}</div>
        <div style={scale(1)}>{listen.ArtistName}</div>
        <div style={scale(1)}>{listen.AlbumName}</div>
      </ListenInfo>
    </Listen>
  );
};

export default CurrentlyPlaying;
