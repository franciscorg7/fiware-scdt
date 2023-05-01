import React from "react";
import styled from "styled-components";
import { Modal, Button } from "antd";
import { highlightOrange, textBlue } from "../../palette";

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

const NewRepetitionModal = ({ show, setShow, onSave, onSaveLoading }) => {
  return (
    <StyledModal
      title={<ModalTitle>New repetition...</ModalTitle>}
      open={show}
      keyboard
      closable={false}
      confirmLoading={onSaveLoading}
      footer={[
        <CreateButton
          type="primary"
          loading={onSaveLoading}
          onClick={() => onSave()}
        >
          Create
        </CreateButton>,
      ]}
      onCancel={() => setShow(false)}
    >
      <ModalContent></ModalContent>
    </StyledModal>
  );
};

export default NewRepetitionModal;
