import React from "react";
import { Table, Tag } from "antd";
import typeTagService from "../../services/type-tag";

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
    },
  ];
  // Apply a key value to each history entry (let React identify table rows)
  const keyedHistory = history?.map((entry, idx) => {
    entry["key"] = idx;
    return entry;
  });
  console.log(keyedHistory);
  return <Table dataSource={keyedHistory} columns={columns} />;
};

export default EntityHistoryTable;
