import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Empty, Tooltip, Badge, List, Divider, Tag } from "antd";
import styled from "styled-components";
import { textBlue } from "../../palette";
import moment from "moment";

const BodyWrapper = styled(Col)`
  padding: 42px;
  height: 100%;
  flex: 1;
  text-align: left;
`;
const SubscriptionId = styled(Row)`
  align-items: center;
  column-gap: 8px;
  & h1 {
    color: ${textBlue};
    margin-bottom: 0;
  }
`;
const SubscriptionDescription = styled(Row)`
  align-items: center;
  column-gap: 8px;
  margin-bottom: 24px;
  & h5 {
    color: ${textBlue};
    opacity: 0.5;
    margin-top: 6px;
  }
`;
const CenteredEmpty = styled(Empty)`
  top: 40%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const StatusCol = styled(Col)`
  display: flex;
  height: 100%;
  justify-content: center;
`;
const FirstLevelKeyTitle = styled.h2`
  margin: ${(props) =>
    props.additionalMargin
      ? `${props.additionalMargin}px 12px 0 0`
      : "4px 12px 0 0;"};
`;
const StyledDivider = styled(Divider)`
  margin: 12px 0;
`;
const StyledList = styled(List)`
  & .ant-list-header {
    padding-block: 0px;
  }
`;
const EntityIdAsListItem = styled(List.Item)`
  cursor: pointer;
  color: ${textBlue};
  width: fit-content;
`;
const LastNotificationTag = styled(Tag)`
  margin: 12px 0 0 0;
`;
const LastNotificationCode = styled.span`
  font-weight: bold;
  margin-right: 4px;
`;

const SubscriptionPage = () => {
  const navigate = useNavigate();

  // Get current search value from the Navbar
  const subscription = useLocation().state.subscription;

  /**
   * Navigate to entity page given its id
   *
   * @param {string} entityId
   */
  const goToEntity = (entityId) => {
    entityId.endsWith(":dummy")
      ? navigate(`/entity/${entityId.replace(":dummy", "")}`)
      : navigate(`/entity/${entityId}`);
  };

  return (
    <>
      {subscription ? (
        <BodyWrapper>
          <SubscriptionId>
            <h1>{subscription?.id}</h1>
            {subscription?.status === "active" ? (
              <StatusCol>
                <Tooltip title="Active">
                  <Badge status="success" />
                </Tooltip>
              </StatusCol>
            ) : (
              <StatusCol>
                <Tooltip title="Inactive">
                  <Badge status="error" />
                </Tooltip>
              </StatusCol>
            )}
          </SubscriptionId>
          <SubscriptionDescription>
            <h5>{subscription?.description}</h5>
          </SubscriptionDescription>
          <Badge count={subscription?.notification?.timesSent}>
            <FirstLevelKeyTitle>Notification</FirstLevelKeyTitle>
          </Badge>
          <br />
          <Tooltip
            title={
              subscription?.notification?.lastSuccess ? (
                <span>
                  <b>Success:</b> {subscription?.notification?.lastSuccessCode}
                </span>
              ) : subscription?.notification?.lastFailure ? (
                <span>
                  <b>Failure:</b> {subscription?.notification?.lastFailureCode}
                </span>
              ) : null
            }
            placement="right"
          >
            <LastNotificationTag
              color={
                subscription?.notification?.lastSuccess
                  ? "success"
                  : subscription?.notification?.lastFailure
                  ? "error"
                  : ""
              }
            >
              <LastNotificationCode>Last Time Sent:</LastNotificationCode>
              {moment(subscription?.notification?.lastSuccess).format(
                "DD MMM YYYY (HH:mm:ss)"
              )}
            </LastNotificationTag>
          </Tooltip>
          <h6>{subscription?.notification?.http?.url}</h6>
          <StyledDivider />
          <StyledList
            size="small"
            header={<h4>Attributes</h4>}
            dataSource={subscription?.notification?.attrs}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <FirstLevelKeyTitle additionalMargin={42}>Subject</FirstLevelKeyTitle>
          <StyledDivider />
          <StyledList
            size="small"
            header={<h4>Condition Attributes</h4>}
            dataSource={subscription?.subject?.condition?.attrs}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <StyledList
            size="small"
            header={<h4>Entities</h4>}
            dataSource={subscription?.subject?.entities?.map(
              (entity) => entity.id
            )}
            renderItem={(item) => (
              <EntityIdAsListItem onClick={() => goToEntity(item)}>
                {item}
              </EntityIdAsListItem>
            )}
          />
        </BodyWrapper>
      ) : (
        <CenteredEmpty description="No data found for requested subscription." />
      )}
    </>
  );
};

export default SubscriptionPage;
