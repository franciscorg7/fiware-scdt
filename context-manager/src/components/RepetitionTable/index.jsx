import React from "react";
import { Empty, Table } from "antd";
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
const CenteredEmpty = styled(Empty)`
  top: 40%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const RepetitionTable = ({ repetitions }) => {
  // Repetition columns definition
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Start",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => {
        if (!startDate) return "-";
        const parsedStartDate = moment(startDate, "YYYY-MM-DD HH:mm:ss");
        return parsedStartDate.format("DD MMM YYYY (HH:mm:ss)");
      },
    },
    {
      title: "End",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => {
        if (!endDate) return "-";
        const parsedEndDate = moment(endDate, "YYYY-MM-DD HH:mm:ss");
        return parsedEndDate.format("DD MMM YYYY (HH:mm:ss)");
      },
    },
  ];
  // Apply a key value to each history entry (let React identify table rows)
  const keyedRepetitions = repetitions?.map((entry, idx) => {
    entry["key"] = idx;
    return entry;
  });
  return (
    <>
      {repetitions ? (
        <StyledTable
          dataSource={keyedRepetitions}
          columns={columns}
          pagination={{ position: ["none", "bottomCenter"] }}
        />
      ) : (
        <CenteredEmpty description="No repetitions found." />
      )}
    </>
  );
};

export default RepetitionTable;
