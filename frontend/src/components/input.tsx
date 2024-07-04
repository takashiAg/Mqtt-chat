// container component

import styled from "styled-components";

interface InputProps {}
export const Input = styled.input<InputProps>`
  padding: 10px;
  margin: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  background-color: #fff;
  box-sizing: border-box;
`;

export default Input;
