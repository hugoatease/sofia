import React, { useState } from "react";
import { createGlobalStyle } from "styled-components";
import { useInterval } from "react-use";
import axios from "axios";

const BackgroundStyle = createGlobalStyle`
  body {
    background-image: url("${(props) => props.image}");
    transition: background-image 2s;
  }
`;

const IMAGE_URL =
  "https://source.unsplash.com/1920x1080/?abstract,water,architecture";

const Background = () => {
  const [imageUrl, setImageUrl] = useState(IMAGE_URL);

  useInterval(() => {
    fetchImage();
  }, 30000);

  const fetchImage = async () => {
    const image = await axios.get(IMAGE_URL, { responseType: "blob" });
    const imageUrl = URL.createObjectURL(image.data);
    setImageUrl(imageUrl);
  };

  return <BackgroundStyle image={imageUrl} />;
};

export default Background;
