import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const BodyWrapper = styled.div`
  padding: 42px;
  height: 100%;
  flex: 1;
`;
const NavigationButton = styled.div``;
const HomePage = () => {
  return (
    <BodyWrapper>
      <Link to="/entity/list">
        <NavigationButton>Entities</NavigationButton>
      </Link>
      <Link to="/entity/list">
        <NavigationButton></NavigationButton>
      </Link>
      <Link to="/entity/list">
        <NavigationButton></NavigationButton>
      </Link>
      <Link to="/entity/list">
        <NavigationButton></NavigationButton>
      </Link>
    </BodyWrapper>
  );
};

export default HomePage;
