import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ngsiJSService from "../../services/ngsijs";
import { Row, Col, Empty, Tag, Descriptions, Switch, notification } from "antd";
import styled from "styled-components";
import { highlightOrange, textBlue } from "../../palette";
import typeTagService from "../../services/type-tag";
import EntityHistoryTable from "../../components/EntityHistoryTable";
import AttributeTypeTag from "../../components/AttributeTypeTag";
import { DatabaseOutlined, HistoryOutlined } from "@ant-design/icons";

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
const FiltersSwitchWrapper = styled(Col)`
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

  & #history-span {
    margin-left: 24px;
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
const CenteredEmpty = styled(Empty)`
  top: 40%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const EntityPage = () => {
  const { id } = useParams();
  const [entity, setEntity] = useState(null);
  const [entityAttrs, setEntityAttrs] = useState(null);
  const [entityHistory, setEntityHistory] = useState(null);
  const [seeHistory, setSeeHistory] = useState(false);
  const [seeRepetition, setSeeRepetition] = useState(false);
  const [notifAPI, contextHolder] = notification.useNotification();

  /**
   * Whenever entity view changes, handle corresponding data
   * to be presented in that view.
   */
  useEffect(() => {
    if (id) {
      seeHistory ? handleGetHistory() : handleGetEntityById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, seeHistory, seeRepetition]);

  /**
   * Handle entity history getter by calling ngsiJSService
   * and propagating it to affected components (only if entity
   * details are not yet in state).
   */
  const handleGetEntityById = () => {
    ngsiJSService.getEntityById(!seeRepetition ? id : `${id}:dummy`).then(
      (result) => {
        setEntity(result.entity);
        setEntityAttrs(
          Object.keys(result.entity).filter(
            (key) => key !== "id" && key !== "type"
          )
        );
      },
      (error) => {
        notifAPI["error"]({
          message: <b>{error.message ?? "There was a problem"}</b>,
          description: "Couldn't fetch the required entity data.",
        });
      }
    );
  };

  /**
   * Handle entity history getter by calling ngsiJSService
   * and propagating it to affected components (only if entity
   * history is not yet in state).
   */
  const handleGetHistory = () => {
    ngsiJSService.getEntityHistory(!seeRepetition ? id : `${id}:dummy`).then(
      (results) => {
        setEntityHistory(results);
        setSeeHistory(true);
      },
      (error) => {
        notifAPI["error"]({
          message: <b>{error.message ?? "There was a problem"}</b>,
          description: "Couldn't fetch the required entity historical data.",
        });
      }
    );
  };

  /**
   * Switch between entity details and entity history view
   */
  const switchHistoryView = () => {
    setSeeHistory(!seeHistory);
  };

  /**
   * Switch between entity data to entity dummy view
   */
  const switchRepetitionView = () => {
    setSeeRepetition(!seeRepetition);
  };

  return (
    <>
      {contextHolder}
      {entity ? (
        <BodyWrapper>
          <EntityTitle>
            <h1>{id}</h1>
            <StyledTag
              bordered="false"
              color={typeTagService.getTypeTagColor(entity?.type)}
            >
              {entity?.type}
            </StyledTag>
            <FiltersSwitchWrapper>
              <span>
                <HistoryOutlined
                  className={seeRepetition ? "rotate-once" : ""}
                />
                View Repetition
              </span>
              <Switch checked={seeRepetition} onClick={switchRepetitionView} />
              <span id="history-span">
                <DatabaseOutlined />
                View History
              </span>
              <Switch checked={seeHistory} onClick={switchHistoryView} />
            </FiltersSwitchWrapper>
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
        <CenteredEmpty description="No data found for requested entity." />
      )}
    </>
  );
};

export default EntityPage;
