import React, { useState } from "react";
import styled from "styled-components";
import { CompassOutlined, IdcardOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";

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
const FormWrapper = styled.div`,
  width: 50%;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  justify-content: flex-start;

  > * {
    width: 20vw;
  }
`;
const CreateButton = styled(Button)`
  background-color: #d50e0e;
  color: white;
  font-weight: bold;
`;

const NewEntityPage = () => {
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);

  return (
    <PageWrapper>
      <TitleWrapper>
        <h1>New entity...</h1>
      </TitleWrapper>
      <FormWrapper>
        <Input
          size="large"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          prefix={<IdcardOutlined />}
        />
        <Input
          size="large"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          prefix={<IdcardOutlined />}
        />

        <CreateButton>CREATE</CreateButton>
      </FormWrapper>
    </PageWrapper>
  );
};

export default NewEntityPage;
