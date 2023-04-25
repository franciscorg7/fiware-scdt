import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Card } from "antd";
import {
  HistoryOutlined,
  ExperimentOutlined,
  IdcardOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import {
  bgBlue,
  bgLightBlue,
  highlightCyan,
  highlightOrange,
} from "../../palette";

const BodyWrapper = styled.div`
  padding: 42px;
  height: 100%;
  flex: 1;
  align-items: center;
  display: flex;
  justify-content: center;
`;
const MenuGrid = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-gap: 14px;
`;
const NavigationButton = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 300px;
  height: 300px;
  cursor: pointer;
  transition: transform 0.2s ease-in;
  text-decoration: none !important;
  font-size: 24px;
  background: ${(props) =>
    props.context === "entities"
      ? "orange"
      : props.context === "repetitions"
      ? highlightOrange
      : props.context === "compare"
      ? highlightCyan
      : bgLightBlue};

  & .ant-card-body {
    display: flex;
    align-items: center;
    column-gap: 6px;
  }

  &:hover {
    transform: scale(1.04);
  }
`;
const NoDecoratedLink = styled(Link)`
  text-decoration: none;
`;
const HomePage = () => {
  return (
    <BodyWrapper>
      <MenuGrid>
        <NoDecoratedLink to="/entity/list">
          <NavigationButton context={"entities"}>
            <IdcardOutlined />
            Entities
          </NavigationButton>
        </NoDecoratedLink>
        <NoDecoratedLink to="/repetition/list">
          <NavigationButton context={"repetitions"}>
            <HistoryOutlined />
            Repetitions
          </NavigationButton>
        </NoDecoratedLink>
        <NoDecoratedLink to="/compare">
          <NavigationButton context={"compare"}>
            <ExperimentOutlined />
            Compare
          </NavigationButton>
        </NoDecoratedLink>
        <NoDecoratedLink to="/subscription/list">
          <NavigationButton context={"subscriptions"}>
            <WifiOutlined />
            Subscriptions
          </NavigationButton>
        </NoDecoratedLink>
      </MenuGrid>
    </BodyWrapper>
  );
};

export default HomePage;
