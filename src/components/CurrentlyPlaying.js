import React, { useState } from "react";
import { useTopic } from "react-mqtt";

const CurrentlyPlaying = () => {
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
    <div>
      <img src={listen.ImageURL} alt="" />
      <div>{listen.ArtistName}</div>
      <div>{listen.AlbumName}</div>
      <div>{listen.TrackName}</div>
    </div>
  );
};

export default CurrentlyPlaying;
