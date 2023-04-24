import React from "react";
import { highlightOrange, textBlue } from "../../palette";
import styled from "styled-components";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Row, Col } from "antd";

const NavbarWrapper = styled(Row)`
  justify-content: flex-start;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  color: ${highlightOrange};
  & span {
    color: ${textBlue};
  }
`;

const TitleWrapper = styled(Col)`
  justify-content: flex-start;
  font-size: 12px;
`;
const SearchBarWrapper = styled(Col)`
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  width: 300px;
`;

const SearchBar = styled(Input)``;

const Navbar = () => {
  return (
    <NavbarWrapper>
      <TitleWrapper>
        <h1>
          <span>FIWARE</span> Context Manager
        </h1>
      </TitleWrapper>
      <SearchBarWrapper>
        <SearchBar size="medium" prefix={<SearchOutlined />} />
      </SearchBarWrapper>
    </NavbarWrapper>
  );
};

export default Navbar;
