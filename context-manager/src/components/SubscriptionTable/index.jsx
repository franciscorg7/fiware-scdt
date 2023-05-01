import React from "react";
import { Empty, Table, Badge, Row, Tooltip } from "antd";
import moment from "moment";
import styled from "styled-components";
import { highlightCyan, textBlue } from "../../palette";
import { useNavigate } from "react-router-dom";

const StyledTable = styled(Table)`
  & thead > tr > * {
    background: ${highlightCyan} !important;
    color: #ffff !important;
    font-weight: bold !important;
  }
`;
const IdentifierRow = styled(Row)`
  column-gap: 8px;
`;
const CenteredEmpty = styled(Empty)`
  top: 40%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const ViewMoreBtn = styled.span`
  cursor: pointer;
  font-weight: bold;
  color: ${textBlue};
`;

const SubscriptionTable = ({ subscriptions }) => {
  // Initialize useNavigate hook
  const navigate = useNavigate();

  /**
   * Navigates to Subscription page showing more details
   * @param {Subscritpion} subscription
   */
  const viewMore = (subscription) => {
    navigate(`/subscription/details`, {
      state: { subscription: subscription },
    });
  };

  // Repetition columns definition
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (id, row) => (
        <IdentifierRow>
          <span>{id}</span>
          {row.status === "active" ? (
            <Tooltip title="Active">
              <Badge status="success" />
            </Tooltip>
          ) : (
            <Tooltip title="Inactive">
              <Badge status="error" />
            </Tooltip>
          )}
        </IdentifierRow>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Expire Date",
      dataIndex: "expires",
      key: "expires",
      render: (expireDate) => {
        if (!expireDate) return "-";
        const parsedExpireDate = moment(expireDate, "YYYY-MM-DD");
        return parsedExpireDate.format("DD MMM YYYY");
      },
    },
    {
      key: "actions",
      render: (_, row) => (
        <ViewMoreBtn onClick={() => viewMore(row)}>View more</ViewMoreBtn>
      ),
    },
  ];
  // Apply a key value to each history entry (let React identify table rows)
  const keyedSubscriptions = subscriptions?.map((entry, idx) => {
    entry["key"] = idx;
    return entry;
  });
  return (
    <>
      {subscriptions ? (
        <StyledTable dataSource={keyedSubscriptions} columns={columns} />
      ) : (
        <CenteredEmpty description="No subscriptions found." />
      )}
    </>
  );
};

export default SubscriptionTable;
