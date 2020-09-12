import React from "react";
import styled from "styled-components";
import { scale, rhythm } from "ui";
import { BUILD_ID } from "../constants";

const Name = styled.div`
  display: flex;
  align-items: center;
  background-color: #fa7a35;
  ${scale(1 / 2)};
  padding: 0 ${rhythm(0.75)};
`;

const FooterWrapper = styled.div`
  background-color: #000;
  color: #fff;
  height: 4vh;
  display: flex;
  justify-content: space-between;
`;

const Infos = styled.div`
  display: flex;
  align-items: center;
  ${scale(1 / 4)};
  margin-right: ${rhythm(1 / 2)};

  > * + * {
    margin-left: ${rhythm(1)};
    position: relative;
    &:before {
      content: "";
      position: absolute;
      display: block;
      top: 0;
      bottom: 0;
      left: -${rhythm(1 / 2)};
      width: 2px;
      background-color: #fff;
    }
  }
`;

const Footer = ({ style }) => {
  return (
    <FooterWrapper style={style}>
      <Name>Sofia</Name>
      <Infos>
        <div>{BUILD_ID}</div>
      </Infos>
    </FooterWrapper>
  );
};

export default Footer;
