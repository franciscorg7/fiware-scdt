import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button } from "antd";
import axios from "axios";

const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
`;
const TitleWrapper = styled.div`
  width: 100%;
  font-size: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
const BodyWrapper = styled.div``;
const ActionsWrapper = styled.div``;
const StyledButton = styled(Button)`
  font-weight: bold;
`;

const ADDRESS = process.env.REACT_APP_API_HOST;
const PORT = process.env.REACT_APP_API_PORT;

const HomePage = () => {
  useEffect(() => {
    axios
      .get(`${ADDRESS}:${PORT}/entity/list`, {
        mode: "no-cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then((res) => {
        const entities = res.data;
        console.log(entities);
      });
  }, []);
  return (
    <PageWrapper>
      <TitleWrapper>
        <h1>FIWARE Context Consumer</h1>
      </TitleWrapper>
      <BodyWrapper>
        <ActionsWrapper>
          <Link to="/new-entity">
            <StyledButton>Register Entity</StyledButton>
          </Link>
        </ActionsWrapper>
      </BodyWrapper>
    </PageWrapper>
  );
};

export default HomePage;
