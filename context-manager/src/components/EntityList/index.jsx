import React from "react";
import EntityCard from "../EntityCard";
import { Empty, List, Row, FloatButton } from "antd";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import { highlightOrange } from "../../palette";

const StyledFloatButton = styled(FloatButton)`
  width: 60px;
  height: 60px;
  & .ant-float-btn-body {
    background: ${highlightOrange};
    transition: opacity 0.1s ease-in-out;
    opacity: 0.8;

    & .ant-float-btn-icon {
      color: #fff !important;
    }
  }

  & .ant-float-btn-body:hover {
    background: ${highlightOrange};
    opacity: 1;
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
          <List
            grid={gridConfig}
            dataSource={entityList}
            renderItem={(entity, idx) => (
              <List.Item key={`${entity.id}:idx`}>
                <EntityCard entity={entity}></EntityCard>
              </List.Item>
            )}
          />
          <StyledFloatButton
            icon={<PlusOutlined />}
            tooltip={<div>New entity</div>}
            onClick={onNewEntity}
          />
        </>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default EntityList;
