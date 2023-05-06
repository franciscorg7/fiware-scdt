import React, { useState, useEffect } from "react";
import ngsiJSService from "../../services/ngsijs";
import { Row, Col, notification } from "antd";
import styled from "styled-components";
import { textBlue } from "../../palette";
import SubscriptionTable from "../../components/SubscriptionTable";

const BodyWrapper = styled(Col)`
  padding: 42px;
  height: 100%;
  flex: 1;
  text-align: left;
`;
const Title = styled(Row)`
  align-items: center;
  column-gap: 8px;
  & h1 {
    color: ${textBlue};
  }
  & .ant-tag {
    height: fit-content;
  }
`;

const SubscriptionListPage = () => {
  const [subscriptions, setSubscriptions] = useState(null);
  const [notifAPI, contextHolder] = notification.useNotification();
  useEffect(() => {
    handleGetSubscriptionList();
  }, []);

  /**
   * Handle subscriptions getter by calling ngsiJSService
   */
  const handleGetSubscriptionList = () => {
    ngsiJSService.getSubscriptionList().then(
      (results) => {
        setSubscriptions(results);
      },
      (error) => {
        notifAPI["error"]({
          message: <b>{error.message ?? "There was a problem"}</b>,
          description: "Couldn't fetch the subscription list.",
        });
      }
    );
  };
  return (
    <>
      {contextHolder}
      <BodyWrapper>
        <Title>
          <h1>Subscriptions</h1>
        </Title>
        <SubscriptionTable subscriptions={subscriptions} />
      </BodyWrapper>
    </>
  );
};

export default SubscriptionListPage;
