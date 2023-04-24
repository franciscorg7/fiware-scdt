import React from "react";
import Entity from "../Entity";
import { Empty, List, Row } from "antd";
import styled from "styled-components";
import { PlusCircleFilled, EditFilled } from "@ant-design/icons";
import { highlightOrange } from "../../palette";

const EditRow = styled(Row)`
  display: flex;
  justify-content: flex-end;
  padding: 24px 0;
`;
const StyledPlusCircleFilled = styled(PlusCircleFilled)`
  display: flex;
  align-items: center;
  margin: 64px;
  color: ${highlightOrange};
  font-size: 64px;
  position: absolute;
  bottom: 0;
  right: 0;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const EntityList = ({ entityList, onNewEntity }) => {
  // List grid responsiveness configuration
  const gridConfig = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
    xxl: 4,
    gutter: 16,
  };
  return (
    <>
      {entityList?.length !== 0 ? (
        <>
          <EditRow>
            <EditFilled />
          </EditRow>
          <List
            grid={gridConfig}
            dataSource={entityList}
            renderItem={(entity) => (
              <List.Item key={entity.id}>
                <Entity entity={entity}></Entity>
              </List.Item>
            )}
          />
          <StyledPlusCircleFilled onClick={onNewEntity} />
        </>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default EntityList;
