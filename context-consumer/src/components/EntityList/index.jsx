import React from "react";
import Entity from "../Entity";
import { Row } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { PlusCircleFilled } from "@ant-design/icons";

const ResponsiveGrid = styled(Row)`
  width: 100%;
  display: flex;
  gap: 16px;
`;

const ActionsWrapper = styled.div`
  font-size: 42px;
`;

const EntityList = ({ entityList, onNewEntity }) => {
  return (
    <ResponsiveGrid>
      {entityList.map((entity) => (
        <Entity key={entity.id} entity={entity}></Entity>
      ))}
      <ActionsWrapper>
        <PlusCircleFilled onClick={onNewEntity} />
      </ActionsWrapper>
    </ResponsiveGrid>
  );
};

export default EntityList;
