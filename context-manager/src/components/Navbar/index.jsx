import React, { useState, useRef } from "react";
import { highlightCyan, highlightOrange, textBlue } from "../../palette";
import styled from "styled-components";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Row, Col, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import {
  HistoryOutlined,
  ExperimentOutlined,
  IdcardOutlined,
  WifiOutlined,
} from "@ant-design/icons";

const NavbarWrapper = styled(Row)`
  justify-content: space-between;
  align-items: center;
  column-gap: 24px;
  padding: 0 24px;
  background: #fff;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.1);
`;
const TitleLink = styled(Link)`
  flex: 1;
`;

const TitleWrapper = styled(Col)`
  height: fit-content;
  justify-content: flex-start;
  font-size: 12px;
  user-select: none;
  & span {
    color: ${textBlue};
  }
  & h1 {
    text-align: left;
  }
  color: ${highlightOrange};
`;
const SearchBarWrapper = styled(Col)`
  flex: 2;
  justify-content: center;
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
const NavigationMenu = styled(Menu)`
  flex: 1;
  justify-content: flex-end;
  & .ant-menu-overflow-item .ant-menu-item .ant-menu-item-selected {
    color: ${textBlue} !important;
    border-bottom-width: 2px;
    border-bottom-color: ${highlightOrange} !important;
  }
`;

const SearchBar = styled(Input)``;

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const navbarMenuItems = [
    { key: 1, label: "Entities", icon: <IdcardOutlined /> },
    { key: 2, label: "Repetitions", icon: <HistoryOutlined /> },
    { key: 3, label: "Compare", icon: <ExperimentOutlined /> },
    { key: 4, label: "Subscriptions", icon: <WifiOutlined /> },
  ];

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

  /**
   * Handle navigation menu click
   *
   * @param {Event} event
   */
  const handleNavMenuClick = (event) => {
    switch (event.key) {
      case "1":
        navigate("/entity/list");
        break;
      case "2":
        navigate("/repetition/list");
        break;
      case "3":
        navigate("/compare");
        break;
      case "4":
        navigate("/subscription/list");
        break;
      default:
        break;
    }
  };

  return (
    <NavbarWrapper>
      <TitleLink to="/">
        <TitleWrapper>
          <h1>
            <span>FIWARE</span> Context Manager
          </h1>
        </TitleWrapper>
      </TitleLink>
      <SearchBarWrapper>
        <SearchBar
          ref={searchBarRef}
          size="medium"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </SearchBarWrapper>
      <NavigationMenu
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        items={navbarMenuItems}
        onClick={(event) => handleNavMenuClick(event)}
      />
    </NavbarWrapper>
  );
};

export default Navbar;
