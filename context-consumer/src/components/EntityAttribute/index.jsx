import React from "react";
import { useState } from "react";
import { Row, Input, Col } from "antd";
import styled from "styled-components";
import { DeleteOutlined } from "@ant-design/icons";

const AttributeWrapper = styled(Row)`
  & #remove-btn-wrapper {
    display: none;
  }

  &:hover #remove-btn-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const ValueTypeForm = styled(Row)`
  column-gap: 4px;
  & * {
    flex: 1;
  }
`;
const InputsWrapper = styled(Col)`
  flex: 5;
`;
const RemoveButtonWrapper = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const EntityAttribute = ({ id, name, value, type, onRemove }) => {
  const [localName, setLocalName] = useState(name || "");
  const [localValue, setLocalValue] = useState(value || "");
  const [localType, setLocalType] = useState(type || "");

  return (
    <AttributeWrapper>
      <InputsWrapper>
        <Input
          size="medium"
          placeholder="Name"
          value={name}
          onChange={(e) => setLocalName(e.target.value)}
          bordered={false}
        />
        <ValueTypeForm>
          <Input
            size="medium"
            placeholder="Value"
            value={value}
            onChange={(e) => setLocalValue(e.target.value)}
          />
          <Input
            size="medium"
            placeholder="Type"
            value={type}
            onChange={(e) => setLocalType(e.target.value)}
          />
        </ValueTypeForm>
      </InputsWrapper>
      <RemoveButtonWrapper id="remove-btn-wrapper">
        <DeleteOutlined onClick={() => onRemove(id)} />
      </RemoveButtonWrapper>
    </AttributeWrapper>
  );
};

export default EntityAttribute;
