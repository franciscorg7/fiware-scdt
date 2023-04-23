import React from "react";
import Entity from "../Entity";
import { Row } from "antd";
import styled from "styled-components";
import { PlusCircleFilled } from "@ant-design/icons";
import { highlightOrange } from "../../palette";

const ResponsiveGrid = styled(Row)`
  width: 100%;
  display: flex;
  gap: 16px;
`;
const StyledPlusCircleFilled = styled(PlusCircleFilled)`
  display: flex;
  align-items: center;
  padding: 24px;
  color: ${highlightOrange};
`;

const EntityList = ({ entityList, onNewEntity }) => {
  return (
    <>
      {entityList?.length !== 0 ? (
        <ResponsiveGrid>
          {entityList.map((entity) => (
            <Entity key={entity.id} entity={entity}></Entity>
          ))}
          <StyledPlusCircleFilled
            onClick={onNewEntity}
            style={{ fontSize: 42 }}
          />
        </ResponsiveGrid>
      ) : (
        <span>Não foram encontrados resultados.</span>
      )}
    </>
  );
};

export default EntityList;
