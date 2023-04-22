import React, { useState } from "react";
import styled from "styled-components";
import { CompassOutlined, IdcardOutlined } from "@ant-design/icons";
import { JsonViewer } from "@textea/json-viewer";
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

  const object = {
    id: "sensor:MultipleSensor:1",
    type: "Sensor",
    airQuality: {
      type: "Integer",
      value: 12,
      metadata: {},
    },
    cloudcover: {
      type: "Float",
      value: 50,
      metadata: {},
    },
    humidity: {
      type: "Float",
      value: 96,
      metadata: {},
    },
    noise: {
      type: "Float",
      value: 90,
      metadata: {},
    },
    precipitation: {
      type: "Float",
      value: 70,
      metadata: {},
    },
    pressure: {
      type: "Float",
      value: 1012.3,
      metadata: {},
    },
    subscriptions: {
      type: "Array",
      value: ["643c1accc3064b16770384dc"],
      metadata: {},
    },
    temperature: {
      type: "Float",
      value: 10.2,
      metadata: {},
    },
    windspeed: {
      type: "Float",
      value: 2.2,
      metadata: {},
    },
  };

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
        <JsonViewer value={object} />

        <CreateButton>CREATE</CreateButton>
      </FormWrapper>
    </PageWrapper>
  );
};

export default NewEntityPage;
