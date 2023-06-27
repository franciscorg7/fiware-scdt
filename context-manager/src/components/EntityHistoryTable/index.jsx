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

const InnerTypeTag = styled(Tag)`
  border: 0px;
`;

const EntityHistoryTable = ({ seeRepetition, history }) => {
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
      title: "Repetition",
      dataIndex: "repetition",
      key: "repetition",
      hidden: !seeRepetition,
    },
    {
      title: "Type",
      dataIndex: "attrType",
      key: "attrType",
      render: (type) => (
        <InnerTypeTag
          bordered="false"
          color={typeTagService.getTypeTagColor(type)}
        >
          {type}
        </InnerTypeTag>
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
  ].filter((column) => !column.hidden);

  // Apply a key value to each history entry (let React identify table rows)
  let keyedHistory = history?.map((entry, idx) => {
    entry["key"] = idx;
    return entry;
  });

  // Process each entry repetition reference by aggregating them into groups of similar dates
  if (seeRepetition) {
    const aggregateByRecvTime = keyedHistory?.reduce((acc, entry) => {
      const recvTime = entry.recvTime;
      if (!acc[recvTime]) acc[recvTime] = [];
      acc[recvTime].push(entry);
      return acc;
    }, {});
    aggregateByRecvTime &&
      Object.keys(aggregateByRecvTime).map((recvTime) => {
        const rep = aggregateByRecvTime[recvTime].find(
          (attr) => attr.attrName === "repetition"
        )?.attrValue;
        keyedHistory?.map((entry) => {
          if (entry.recvTime === recvTime) entry.repetition = rep;
        });
      });

    keyedHistory = keyedHistory?.filter((entry) => {
      return entry.attrName !== "repetition";
    });
  }

  return <StyledTable dataSource={keyedHistory} columns={columns} />;
};

export default EntityHistoryTable;
