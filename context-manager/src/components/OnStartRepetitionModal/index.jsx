import React from "react";
import styled from "styled-components";
import { Modal, Button, Row, Col } from "antd";
import successSVG from "../../resources/svg/success.svg";
import errorSVG from "../../resources/svg/error.svg";
import moment from "moment";

const StyledModal = styled(Modal)`
  max-width: 800px;
  width: auto !important;
`;
const ModalContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ContentWrapper = styled(Col)`
  text-align: center;
`;
const ResultMessage = styled.p`
  max-width: 350px;
`;
const ResultDate = styled.p`
  margin-top: 0;
`;
const ResultId = styled.h1`
  margin-bottom: 0;
`;

const OnCreateRepetitionModal = ({ show, setShow, success, result }) => {
  return (
    <StyledModal
      open={show}
      keyboard
      closable={false}
      footer={[<Button onClick={() => setShow(false)}>OK</Button>]}
      onCancel={() => setShow(false)}
    >
      {success ? (
        <ModalContent>
          <Row>
            <img src={successSVG} alt="success" />
          </Row>
          <Row>
            <ContentWrapper>
              <ResultId>Repetition #{result?.id}</ResultId>
              <ResultDate>
                {moment(result?.startDate).format("DD/MM/YYYY")}
              </ResultDate>
              <ResultMessage>{result?.message}</ResultMessage>
            </ContentWrapper>
          </Row>
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
