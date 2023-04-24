import React from "react";
import { highlightOrange, textBlue } from "../../palette";
import styled from "styled-components";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Row, Col } from "antd";

const SearchBarWrapper = styled(Col)`
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  width: 300px;
`;

const SearchBar = () => {
  return (
    <SearchBarWrapper>
      <Input size="medium" prefix={<SearchOutlined />} />
    </SearchBarWrapper>
  );
};

export default SearchBar;
