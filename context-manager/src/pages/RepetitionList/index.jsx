import React, { useEffect, useState } from "react";
import ngsiJSService from "../../services/ngsijs";
import { Row, Col } from "antd";
import styled from "styled-components";
import { textBlue } from "../../palette";
import RepetitionTable from "../../components/RepetitionTable";

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

const RepetitionListPage = () => {
  const [repetitions, setRepetitions] = useState(null);
  useEffect(() => {
    handleGetRepetitionList();
  }, []);

  /**
   * Handle repetitions getter by calling ngsiJSService
   */
  const handleGetRepetitionList = () => {
    ngsiJSService.getRepetitionList().then(
      (results) => {
        setRepetitions(results);
      },
      (error) => {
        //TODO: handle getRepetitionList error situation
      }
    );
  };

  return (
    <>
      <BodyWrapper>
        <Title>
          <h1>Repetitions</h1>
        </Title>
        <RepetitionTable repetitions={repetitions} />
      </BodyWrapper>
    </>
  );
};

export default RepetitionListPage;
