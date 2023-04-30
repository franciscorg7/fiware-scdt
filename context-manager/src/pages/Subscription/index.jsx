import React from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Empty, Tooltip, Badge, List, Divider } from "antd";
import styled from "styled-components";
import { textBlue } from "../../palette";

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
const SecondLevelKeyTitle = styled.h4``;
const StyledDivider = styled(Divider)`
  margin: 12px 0;
`;
const StyledList = styled(List)`
  & .ant-list-header {
    padding-block: 0px;
  }
`;

const SubscriptionPage = () => {
  // Get current search value from the Navbar
  const subscription = useLocation().state.subscription;
  console.log(subscription);

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
          <SecondLevelKeyTitle>Entities</SecondLevelKeyTitle>
          <StyledDivider />
          <StyledList
            size="small"
            header={<div>Attributes</div>}
            dataSource={subscription?.subject?.condition?.attrs}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </BodyWrapper>
      ) : (
        <CenteredEmpty description="No data found for requested subscription." />
      )}
    </>
  );
};

export default SubscriptionPage;
