import React, { useState } from "react";
import styled from "styled-components";
import { IdcardOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import { JsonViewer } from "@textea/json-viewer";
import { PlusCircleFilled } from "@ant-design/icons";
import EntityAttribute from "../EntityAttribute";
import { bgBlue, highlightOrange } from "../../palette";

const StyledModal = styled(Modal)`
  max-width: 800px;
  width: auto !important;
`;
const ModalContent = styled.div`
  width: 100%;
  display: flex;
  column-gap: 42px;
`;
const Form = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;
const ScrollableJsonViewer = styled(JsonViewer)`
  width: 50%;
  max-height: 600px;
  overflow: hidden;
`;
const StyledPlusCircleFilled = styled(PlusCircleFilled)`
  font-size: 16px;
  color: ${highlightOrange};
`;

const NewEntityModal = ({ show, setShow, onSave, onSaveLoading }) => {
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [entityObj, setEntityObj] = useState({});
  const [attrList, setAttrList] = useState([]);

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

  /**
   * Adds a default attribute to the attribute list
   */
  const addAttr = () => {
    setAttrList([...attrList, {}]);
  };

  /**
   * Removes the attribute indexed by idx
   *
   * @param {Number} idx
   */
  const onRemoveAttr = (idx) => {
    setAttrList(attrList.filter((_, index) => index !== idx));
  };

  return (
    <StyledModal
      title="New entity..."
      open={show}
      onOk={onSave}
      keyboard
      closable={false}
      okText="SAVE"
      confirmLoading={onSaveLoading}
      onCancel={() => setShow(false)}
    >
      <ModalContent>
        <Form>
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
          {attrList.map((attr, idx) => (
            <EntityAttribute
              key={`attribute:${idx}`}
              id={idx}
              name={attr.name}
              value={attr.value}
              type={attr.type}
              onRemove={() => onRemoveAttr(idx)}
            />
          ))}
          <StyledPlusCircleFilled onClick={addAttr} />
        </Form>
        <ScrollableJsonViewer theme={"dark"} value={object} />
      </ModalContent>
    </StyledModal>
  );
};

export default NewEntityModal;
