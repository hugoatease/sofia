import styled from "styled-components";
import Typography from "typography";

export const typography = new Typography({
  baseFontSize: "24px",
  baseLineHeight: 2,
});

export const scale = typography.scale;
export const rhythm = typography.rhythm;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
`;

export const Widgets = styled.div`
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: ${rhythm(1 / 2)};
  }
`;

export const Widget = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: ${rhythm(0.5)};
  ${scale(1)};
`;

export const Layout = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-columns: 60vw 40vw;
  overflow: hidden;
`;
