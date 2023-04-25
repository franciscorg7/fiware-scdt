import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ngsiJSService from "../../services/ngsijs";
import { Row, Col, Empty, Tag, Descriptions, Switch } from "antd";
import styled from "styled-components";
import { highlightOrange, textBlue } from "../../palette";
import typeTagService from "../../services/type-tag";
import EntityHistoryTable from "../../components/EntityHistoryTable";
import AttributeTypeTag from "../../components/AttributeTypeTag";
import { HistoryOutlined } from "@ant-design/icons";

const BodyWrapper = styled(Col)`
  padding: 42px;
  height: 100%;
  flex: 1;
  text-align: left;
`;
const EntityTitle = styled(Row)`
  align-items: center;
  column-gap: 8px;
  & h1 {
    color: ${textBlue};
  }
  & .ant-tag {
    height: fit-content;
  }
`;
const HistorySwitchWrapper = styled(Col)`
  margin-left: auto;
  & span {
    font-weight: bold;
    margin-right: 6px;
  }

  & .ant-switch-checked {
    background-color: ${highlightOrange} !important;
  }

  & .rotate-once {
    animation-name: rotate;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`;
const StyledTag = styled(Tag)`
  user-select: none;
`;

const EntityPage = () => {
  const { id } = useParams();
  const [entity, setEntity] = useState(null);
  const [entityAttrs, setEntityAttrs] = useState(null);
  const [entityHistory, setEntityHistory] = useState(null);
  const [seeHistory, setSeeHistory] = useState(false);

  /**
   * Whenever entity view changes, handle corresponding data
   * to be presented in that view.
   */
  useEffect(() => {
    if (id) {
      seeHistory ? handleGetHistory() : handleGetEntityById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, seeHistory]);

  /**
   * Handle entity history getter by calling ngsiJSService
   * and propagating it to affected components (only if entity
   * details are not yet in state).
   */
  const handleGetEntityById = () => {
    !entity &&
      ngsiJSService.getEntityById(id).then(
        (result) => {
          setEntity(result.entity);
          setEntityAttrs(
            Object.keys(result.entity).filter(
              (key) => key !== "id" && key !== "type"
            )
          );
        },
        (error) => {
          // TODO: deal with getEntityById error
        }
      );
  };

  /**
   * Handle entity history getter by calling ngsiJSService
   * and propagating it to affected components (only if entity
   * history is not yet in state).
   */
  const handleGetHistory = () => {
    !entityHistory &&
      ngsiJSService.getEntityHistory(id).then(
        (results) => {
          console.log(results);
          setEntityHistory(results);
          setSeeHistory(true);
        },
        (error) => {
          // TODO: deal with getHistory error
        }
      );
  };

  /**
   * Switch between entity details and entity history view
   */
  const switchView = () => {
    setSeeHistory(!seeHistory);
  };

  return (
    <>
      {entity ? (
        <BodyWrapper>
          <EntityTitle>
            <h1>{entity?.id}</h1>
            <StyledTag
              bordered="false"
              color={typeTagService.getTypeTagColor(entity?.type)}
            >
              {entity?.type}
            </StyledTag>
            <HistorySwitchWrapper>
              <span>
                <HistoryOutlined className={seeHistory ? "rotate-once" : ""} />
                History
              </span>
              <Switch checked={seeHistory} onClick={switchView} />
            </HistorySwitchWrapper>
          </EntityTitle>
          {seeHistory ? (
            <EntityHistoryTable history={entityHistory} />
          ) : (
            <Descriptions layout="vertical" bordered>
              {entityAttrs?.map((attr, idx) => (
                <Descriptions.Item
                  key={`${attr}:${idx}`}
                  label={
                    <AttributeTypeTag attr={attr} type={entity[attr]?.type} />
                  }
                >
                  {entity[attr].value ?? "-"}
                </Descriptions.Item>
              ))}
            </Descriptions>
          )}
        </BodyWrapper>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default EntityPage;
