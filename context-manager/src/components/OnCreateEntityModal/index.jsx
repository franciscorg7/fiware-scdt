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
  width: 100%;
`;
const ResultMessage = styled.p`
  max-width: 400px;
`;
const ResultDate = styled.p`
  margin-top: 0;
`;
const ResultId = styled.h1`
  margin-bottom: 0;
`;

const OnCreateEntityModal = ({ show, setShow, result, success }) => {
  return (
    <StyledModal
      open={show}
      onOk={() => setShow(false)}
      keyboard
      closable={false}
      footer={[<Button onClick={() => setShow(false)}>OK</Button>]}
      okText="Ok"
      onCancel={() => setShow(false)}
    >
      {success ? (
        <ModalContent>
          <Row key="success-img-row">
            <img src={successSVG} alt="success" />
          </Row>
          <Row key="result-content-row">
            <ContentWrapper>
              <ResultId>{result?.entityResult?.entity?.id}</ResultId>
              <ResultDate>
                {moment().format("DD/MM/YYYY (HH:mm:ss)")}
              </ResultDate>
              <ResultMessage>{result?.message}</ResultMessage>
            </ContentWrapper>
          </Row>
        </ModalContent>
      ) : (
        <ModalContent>
          <Row key="error-img-row">
            <img src={errorSVG} alt="error" />
          </Row>
          <Row key="result-content-row">
            <ContentWrapper>
              <ResultId>Something went wrong.</ResultId>
              <ResultMessage>{result?.message}</ResultMessage>
            </ContentWrapper>
          </Row>
        </ModalContent>
      )}
    </StyledModal>
  );
};

export default OnCreateEntityModal;
