// container component

import styled from "styled-components";

interface ContainerProps {
  row?: boolean;
}
export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: ${(props) => (props.row ? "row" : "column")};
  justify-content: start;
  align-items: center;
  padding: 20px;
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  gap: 20px;
`;

export default Container;
