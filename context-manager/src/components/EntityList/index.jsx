import React from "react";
import Entity from "../Entity";
import { Empty, List } from "antd";
import styled from "styled-components";
import { PlusCircleFilled } from "@ant-design/icons";
import { highlightOrange } from "../../palette";

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
  return (
    <>
      {entityList?.length !== 0 ? (
        <>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
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
