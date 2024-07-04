// container component

import styled from "styled-components";

interface HeaderProps {}
export const Header = styled.header<HeaderProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin: 0;
  width: 100%;
  background-color: #333;
  color: #fff;
`;

export default Header;
