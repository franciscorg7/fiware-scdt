import React from "react";
import { Card } from "antd";
import styled from "styled-components";
import EntityHistoryTable from "../EntityHistoryTable";

const StyledCard = styled(Card)`
  width: 80%;
`;

const CompareCard = ({ entityId, entityData }) => {
  return (
    <StyledCard title={entityId} bordered={false}>
      <EntityHistoryTable history={entityData} />
    </StyledCard>
  );
};

export default CompareCard;
