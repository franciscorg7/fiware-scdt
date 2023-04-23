import React from "react";
import { highlightOrange, textBlue } from "../../palette";
import styled from "styled-components";

const NavbarWrapper = styled.div`
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0 24px;
  background: #fff;
  color: ${highlightOrange};
  & span {
    color: ${textBlue};
  }
`;

const Navbar = () => {
  return (
    <NavbarWrapper>
      <h1>
        <span>FIWARE</span> Context Manager
      </h1>
    </NavbarWrapper>
  );
};

export default Navbar;
