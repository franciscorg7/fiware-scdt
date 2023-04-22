import React, { useState } from "react";
import styled from "styled-components";
import { IdcardOutlined } from "@ant-design/icons";
import { Input, Button, Modal } from "antd";

const FormWrapper = styled.div`,
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  justify-content: flex-start;
`;
const CreateButton = styled(Button)`
  background-color: #d50e0e;
  color: white;
  font-weight: bold;
`;

const NewEntityModal = ({ show, setShow, onSave, onSaveLoading }) => {
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);

  return (
    <Modal
      title="New entity..."
      open={show}
      onOk={onSave}
      okText="SAVE"
      confirmLoading={onSaveLoading}
      onCancel={() => setShow(false)}
    >
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
    </Modal>
  );
};

export default NewEntityModal;
