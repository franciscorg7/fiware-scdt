import React from "react";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
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

const EntityAttribute = ({
  id,
  name,
  value,
  type,
  onRemove,
  onAddName,
  onAddType,
  onAddValue,
}) => {
  const [localName, setLocalName] = useState(name || "");
  const [localType, setLocalType] = useState(type || "");
  const [localValue, setLocalValue] = useState(value || "");

  useDebounce(() => onAddName(id, localName), 1000, [localName]);
  useDebounce(() => onAddType(id, localType), 1000, [localType]);
  useDebounce(() => onAddValue(id, localValue), 1000, [localValue]);

  return (
    <AttributeWrapper>
      <InputsWrapper>
        <Input
          size="medium"
          placeholder="name"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          bordered={false}
        />
        <ValueTypeForm>
          <Input
            size="medium"
            placeholder="type"
            value={localType}
            onChange={(e) => setLocalType(e.target.value)}
          />
          <Input
            size="medium"
            placeholder="value"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
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
