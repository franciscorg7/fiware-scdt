import React, { useState } from "react";
import styled from "styled-components";
import { Modal, Button, Radio } from "antd";
import { highlightOrange, textBlue } from "../../palette";
import NewRepetitionForm from "../NewRepetitionForm";
import {
  CloudDownloadOutlined,
  HistoryOutlined,
  CalendarOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";

const StyledModal = styled(Modal)`
  max-width: 800px;
  width: auto !important;

  & .ant-modal-content {
    min-height: 500px;

    & .ant-modal-footer{
      position: absolute;
      bottom 0;
      right: 0;
      margin: 24px;
    }
  }
`;
const ModalTitle = styled.span`
  color: ${textBlue};
  font-size: 24px;
`;
const ModalContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  column-gap: 42px;
`;
const CreateButton = styled(Button)`
  font-weight: bold;
  background-color: ${highlightOrange} !important;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const NewRepetitionModal = ({ show, setShow, onStart, onSaveLoading }) => {
  const [repType, setRepetitionType] = useState(1);
  const repetitionTypeOptions = [
    {
      value: 1,
      label: (
        <span>
          <CloudDownloadOutlined /> From current context
        </span>
      ),
    },
    {
      value: 2,
      label: (
        <span>
          <HistoryOutlined /> From another repetition
        </span>
      ),
    },
    {
      value: 3,
      label: (
        <span>
          <CalendarOutlined /> From start date
        </span>
      ),
    },
  ];

  /**
   * Repetition type handler that propagates current type to the state
   *
   * @param {Event} event
   */
  const onTypeChange = (event) => {
    if (event.target?.value) setRepetitionType(event.target.value);
  };

  return (
    <StyledModal
      title={<ModalTitle>New repetition...</ModalTitle>}
      open={show}
      keyboard
      closable={false}
      confirmLoading={onSaveLoading}
      footer={[
        <CreateButton
          key="start-button"
          type="primary"
          loading={onSaveLoading}
          icon={<CaretRightOutlined />}
          onClick={() => onStart()}
        >
          Start
        </CreateButton>,
      ]}
      onCancel={() => setShow(false)}
    >
      <ModalContent>
        <Radio.Group
          size="large"
          options={repetitionTypeOptions}
          onChange={onTypeChange}
          defaultValue={1}
          value={repType}
          optionType="button"
          buttonStyle="solid"
        />
        <NewRepetitionForm repType={repType} onStart={onStart} />
      </ModalContent>
    </StyledModal>
  );
};

export default NewRepetitionModal;
