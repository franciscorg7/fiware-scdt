import React from "react";
import { Link } from "react-router-dom";
import { Card } from "antd";
import styled from "styled-components";
import { bgBlue } from "../../palette";

const StyledCard = styled(Card)`
  height: 250px;
  width: auto;
  cursor: pointer;
  transition: transform 0.2s ease-in;

  & .ant-card-head {
    background: ${bgBlue};
    color: #ffff;
    text-align: left;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const Entity = ({ entity }) => {
  return (
    <Link to={`/entity/${entity.id}`}>
      <StyledCard title={entity.id} bordered={false}>
        <p>Card content</p>
      </StyledCard>
    </Link>
  );
};

export default Entity;
