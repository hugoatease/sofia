import styled from "styled-components";
import Typography from "typography";

export const Container = styled.div`
  display: grid;
  width: 640px;
  height: 310px;
  overflow: hidden;
  grid-template-columns: 3fr 2fr;
`;

export const Widgets = styled.div`
  display: flex;
  flex-direction: column;
`;

export const typography = new Typography({
  baseFontSize: "26px",
  baseLineHeight: 3,
});

export const scale = typography.scale;
export const rhythm = typography.rhythm;
