import React from "react";
import EntityCard from "../EntityCard";
import { Empty, List } from "antd";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import ActionFloatButton from "../ActionFloatButton";

const CenteredEmpty = styled(Empty)`
  top: 40%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
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
          <ActionFloatButton
            onAction={onNewEntity}
            actionLabel="New entity"
          ></ActionFloatButton>
        </>
      ) : (
        <CenteredEmpty description="No entities found." />
      )}
    </>
  );
};

export default EntityList;
