import React from "react";
import styled from "styled-components";
import { Modal, Button } from "antd";
import successSVG from "../../resources/svg/success.svg";
import errorSVG from "../../resources/svg/error.svg";

const StyledModal = styled(Modal)`
  max-width: 800px;
  width: auto !important;
`;
const ModalContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  column-gap: 42px;
`;

const OnCreateRepetitionModal = ({
  show,
  setShow,
  newRepetitionObj,
  success,
}) => {
  return (
    <StyledModal
      open={show}
      onOk={() => setShow(false)}
      keyboard
      closable={false}
      footer={[<Button>Ok</Button>]}
      okText="Ok"
      onCancel={() => setShow(false)}
    >
      {success ? (
        <ModalContent>
          <img src={successSVG} alt="success" />
        </ModalContent>
      ) : (
        <ModalContent>
          <img src={errorSVG} alt="error" />
        </ModalContent>
      )}
    </StyledModal>
  );
};

export default OnCreateRepetitionModal;
