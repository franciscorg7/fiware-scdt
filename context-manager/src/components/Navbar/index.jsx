import React, { useState, useRef } from "react";
import { highlightCyan, highlightOrange, textBlue } from "../../palette";
import styled from "styled-components";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";

const NavbarWrapper = styled(Row)`
  justify-content: flex-start;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TitleWrapper = styled(Col)`
  height: fit-content;
  justify-content: flex-start;
  font-size: 12px;
  user-select: none;
  & span {
    color: ${textBlue};
  }
  color: ${highlightOrange};
`;
const SearchBarWrapper = styled(Col)`
  position: absolute;
  transform: translate(-50%, 0);
  width: 300px;
  left: 50%;
  transition: all 0.2s ease-in-out;

  & .ant-input-affix-wrapper {
    border-radius: 20px;

    &:hover,
    &:active {
      border-width: 2px;
      border-color: ${highlightCyan} !important;
    }
  }

  & .ant-input-affix-wrapper-focused {
    border-width: 1px;
    border-color: ${highlightCyan} !important;
  }
`;

const SearchBar = styled(Input)``;

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");

  // Create a searchBar reference for focus check
  const searchBarRef = useRef(null);
  const isSearchBarFocused =
    document.activeElement === searchBarRef?.current?.input;

  // Use 500ms debouncing to handle onEntitySearch
  useDebounce(() => isSearchBarFocused && onEntitySearch(searchValue), 500, [
    searchValue,
    isSearchBarFocused,
  ]);

  // Initialize useNavigate hook
  const navigate = useNavigate();

  /**
   * Navigate to /entity/list passing the current search value
   * via the location state.
   *
   * @param {string} searchValue
   */
  const onEntitySearch = (searchValue) => {
    navigate("/entity/list", { state: { idPattern: searchValue } });
  };

  return (
    <NavbarWrapper>
      <Link to="/">
        <TitleWrapper>
          <h1>
            <span>FIWARE</span> Context Manager
          </h1>
        </TitleWrapper>
      </Link>
      <SearchBarWrapper>
        <SearchBar
          ref={searchBarRef}
          size="medium"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </SearchBarWrapper>
    </NavbarWrapper>
  );
};

export default Navbar;
