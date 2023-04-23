import React from "react";
import styled from "styled-components";
import { Modal } from "antd";
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

const OnSaveEntityModal = ({ show, setShow, entityObj, success }) => {
  return (
    <StyledModal
      open={show}
      onOk={() => setShow(false)}
      keyboard
      closable={false}
      okText="Ok"
    >
      {success ? (
        <ModalContent>
          <img src={successSVG} />
        </ModalContent>
      ) : (
        <ModalContent>
          <img src={errorSVG} />
        </ModalContent>
      )}
    </StyledModal>
  );
};

export default OnSaveEntityModal;
