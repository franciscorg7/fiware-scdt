import React from "react";
import { Link } from "react-router-dom";
import { Card, Col, Row, Tag } from "antd";
import AttributeTypeTag from "../AttributeTypeTag";
import styled from "styled-components";
import typeTagService from "../../services/type-tag";
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
const CardBody = styled.div``;
const AttributeWrapper = styled.div`
  margin-bottom: 12px;
`;
const TypeTag = styled(Tag)`
  margin: 0;
  border: 0;
`;
const TitleWrapper = styled(Row)`
  justify-content: space-between;
`;

const EntityCardTitle = ({ entity }) => (
  <TitleWrapper>
    <Col>{entity.id}</Col>
    <Col>
      <TypeTag color={typeTagService.getTypeTagColor(entity.type)}>
        {entity.type}
      </TypeTag>
    </Col>
  </TitleWrapper>
);

const EntityCard = ({ entity }) => {
  // Select the first 4 attributes to preview
  const attributes = Object.keys(entity)
    .filter((key) => key !== "id" && key !== "type")
    .slice(0, 4);

  return (
    <Link to={`/entity/${entity.id}`}>
      <StyledCard title={<EntityCardTitle entity={entity} />} bordered={false}>
        <CardBody>
          {attributes.map((attribute, idx) => (
            <AttributeWrapper key={`${attribute}:${idx}`}>
              <AttributeTypeTag
                className="attribute-type-tag"
                attr={attribute}
                type={entity[attribute].type}
              />
            </AttributeWrapper>
          ))}
        </CardBody>
      </StyledCard>
    </Link>
  );
};

export default EntityCard;
