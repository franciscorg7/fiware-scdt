import React, { useEffect, useState } from "react";
import ngsiJSService from "../../services/ngsijs";
import { Row, Col, notification } from "antd";
import styled from "styled-components";
import { textBlue } from "../../palette";
import RepetitionTable from "../../components/RepetitionTable";
import ActionFloatButton from "../../components/ActionFloatButton";
import NewRepetitionModal from "../../components/NewRepetitionModal";
import OnCreateRepetitionModal from "../../components/OnStartRepetitionModal";

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
  const [showOnStartRepetitionModal, setShowOnStartRepetitionModal] =
    useState(false);
  const [onStartRepetitionLoading, setOnStartRepetitionLoading] =
    useState(false);
  const [newRepetitionObj, setNewRepetitionObj] = useState(null);
  const [startRepetitionSuccess, setStartRepetitionSuccess] = useState(false);
  const [notifAPI, contextHolder] = notification.useNotification();

  /**
   * Whenever component renders call the handler that gets the repetition list 📄
   */
  useEffect(() => {
    handleGetRepetitionList();
  }, []);

  /**
   * Handle repetitions getter by calling ngsiJSService 📁
   */
  const handleGetRepetitionList = () => {
    ngsiJSService.getRepetitionList().then(
      (results) => {
        setRepetitions(results);
      },
      (error) => {
        notifAPI["error"]({
          message: <b>{error.message ?? "There was a problem"}</b>,
          description: "Couldn't fetch the repetition list.",
        });
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
   *  Call ngsiJS service to start a new repetition from given object
   *
   */
  const handleStartRepetition = (newRepetitionObj) => {
    ngsiJSService.startRepetition(newRepetitionObj).then(
      (result) => {
        setShowNewRepetitionModal(false);
        setStartRepetitionSuccess(true);
        setShowOnStartRepetitionModal(true);
      },
      (error) => {
        setShowNewRepetitionModal(false);
        setStartRepetitionSuccess(false);
        setShowOnStartRepetitionModal(true);
      }
    );
  };

  return (
    <>
      {contextHolder}
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
        <OnCreateRepetitionModal
          show={showOnStartRepetitionModal}
          setShow={setShowOnStartRepetitionModal}
          newRepetitionObj={newRepetitionObj}
          success={startRepetitionSuccess}
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
