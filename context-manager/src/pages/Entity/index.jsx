import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ngsiJSService from "../../services/ngsijs";
import { Row, Col, Empty, Tag, Descriptions } from "antd";
import styled from "styled-components";
import { bgLightBlue } from "../../palette";
import typeTagService from "../../services/type-tag";

const BodyWrapper = styled(Col)`
  background: ${bgLightBlue};
  padding: 42px;
  height: 100%;
  flex: 1;
  text-align: left;
`;
const StyledRow = styled(Row)`
  column-gap: 4px;
`;
const EntityTitle = styled(Row)`
  align-items: center;
  column-gap: 8px;
  & .ant-tag {
    height: fit-content;
  }
`;

const AttrLabel = ({ entity, attr }) => {
  return (
    <StyledRow>
      {attr}
      <Tag
        bordered="false"
        color={typeTagService.getTypeTagColor(entity[attr]?.type)}
      >
        {entity[attr]?.type}
      </Tag>
    </StyledRow>
  );
};

const EntityPage = () => {
  const { id } = useParams();
  const [entity, setEntity] = useState(null);
  const [entityAttrs, setEntityAttrs] = useState([]);

  /**
   * Whenever id is available from the current URL params,
   * fetch corresponding entity details.
   */
  useEffect(() => {
    id &&
      ngsiJSService.getEntityById(id).then(
        (result) => {
          setEntity(result.entity);
          setEntityAttrs(
            Object.keys(result.entity).filter(
              (key) => key !== "id" && key !== "type"
            )
          );
        },
        (error) => {}
      );
  }, [id]);

  return (
    <>
      {entity ? (
        <BodyWrapper>
          <EntityTitle>
            <h1>{entity?.id}</h1>
            <Tag
              bordered="false"
              color={typeTagService.getTypeTagColor(entity?.type)}
            >
              {entity?.type}
            </Tag>
          </EntityTitle>
          <Descriptions layout="vertical" bordered>
            {entityAttrs.map((attr, idx) => (
              <Descriptions.Item
                key={`${attr}:${idx}`}
                label={<AttrLabel attr={attr} entity={entity} />}
              >
                {entity[attr].value ?? "-"}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </BodyWrapper>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default EntityPage;
