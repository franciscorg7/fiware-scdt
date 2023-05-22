import React from "react";
import EntityCard from "../EntityCard";
import { Empty, List } from "antd";
import styled from "styled-components";

const CenteredEmpty = styled(Empty)`
  top: 40%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const EntityList = ({ entityList }) => {
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
      {entityList && entityList?.length !== 0 ? (
        <List
          grid={gridConfig}
          dataSource={entityList}
          renderItem={(entity) => (
            <List.Item key={`${entity.id}:idx`}>
              <EntityCard entity={entity}></EntityCard>
            </List.Item>
          )}
        />
      ) : (
        <CenteredEmpty description="No entities found." />
      )}
    </>
  );
};

export default EntityList;
