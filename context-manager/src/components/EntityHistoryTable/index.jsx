import React from "react";
import { Table, Tag } from "antd";
import typeTagService from "../../services/type-tag";
import moment from "moment";
import styled from "styled-components";
import { highlightCyan } from "../../palette";

const StyledTable = styled(Table)`
  & th {
    background: ${highlightCyan} !important;
    color: #ffff !important;
    font-weight: bold !important;
  }
`;

const EntityHistoryTable = ({ history }) => {
  // History columns definition
  const columns = [
    {
      title: "Attribute",
      dataIndex: "attrName",
      key: "attrName",
    },
    {
      title: "Value",
      dataIndex: "attrValue",
      key: "attrValue",
    },
    {
      title: "Type",
      dataIndex: "attrType",
      key: "attrType",
      render: (type) => (
        <Tag bordered="false" color={typeTagService.getTypeTagColor(type)}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Date/Time",
      dataIndex: "recvTime",
      key: "recvTime",
      render: (recvTime) => {
        const parsedRecvTime = moment(recvTime, "YYYY-MM-DD HH:mm:ss.SSS");
        return parsedRecvTime.format("DD MMM YYYY (HH:mm:ss.SSS)");
      },
    },
  ];
  // Apply a key value to each history entry (let React identify table rows)
  const keyedHistory = history?.map((entry, idx) => {
    entry["key"] = idx;
    return entry;
  });
  return <StyledTable dataSource={keyedHistory} columns={columns} />;
};

export default EntityHistoryTable;
