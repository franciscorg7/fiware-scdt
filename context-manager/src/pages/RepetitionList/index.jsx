import React, { useEffect, useState } from "react";
import ngsiJSService from "../../services/ngsijs";
import { Row, Col } from "antd";
import styled from "styled-components";
import { textBlue } from "../../palette";
import RepetitionTable from "../../components/RepetitionTable";
import ActionFloatButton from "../../components/ActionFloatButton";
import NewRepetitionModal from "../../components/NewRepetitionModal";

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
  const [showNewRepetitionModal, setShowNewRepetitionModal] = useState(false);
  const [onStartRepetitionLoading, setOnStartRepetitionLoading] =
    useState(false);

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

  /**
   * Sets the modal open flag to true
   */
  const onNewRepetition = () => {
    setShowNewRepetitionModal(true);
  };

  /**
   *
   */
  const handleStartRepetition = () => {};

  return (
    <>
      <BodyWrapper>
        <Title>
          <h1>Repetitions</h1>
        </Title>
        <RepetitionTable repetitions={repetitions} />
        <NewRepetitionModal
          show={showNewRepetitionModal}
          setShow={setShowNewRepetitionModal}
          onStart={handleStartRepetition}
          onSaveLoading={onStartRepetitionLoading}
        />
        <ActionFloatButton
          onAction={onNewRepetition}
          actionLabel="New repetition"
        />
      </BodyWrapper>
    </>
  );
};

export default RepetitionListPage;
