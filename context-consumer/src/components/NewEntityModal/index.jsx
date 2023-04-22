import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  IdcardOutlined,
  TagOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { Input, Modal } from "antd";
import { JsonViewer } from "@textea/json-viewer";
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
  overflow: auto;
`;
const StyledPlusCircleFilled = styled(PlusCircleFilled)`
  font-size: 16px;
  color: ${highlightOrange};
`;

const NewEntityModal = ({ show, setShow, onSave, onSaveLoading }) => {
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [entityObj, setEntityObj] = useState({});

  // entityObjKeys is an auxiliar list that helps us mapping entityObj attribute names
  const [entityObjKeys, setEntityObjKeys] = useState([]);

  // entityObjKeysTypes and entityObjKeysValues are auxiliar lists that helps us mapping each attribute corresponding type and value
  const [entityObjKeysTypes, setEntityObjKeysTypes] = useState([]);
  const [entityObjKeysValues, setEntityObjKeysValues] = useState([]);

  const [attrList, setAttrList] = useState([]);

  let object = {
    id: "sensor:MultipleSensor:1",
    type: "Sensor",
    airQuality: {
      type: "Integer",
      value: 12,
    },
    cloudcover: {},
  };

  useEffect(() => {
    entityObjKeys.map(
      (objKey, index) =>
        (object[objKey] = {
          type: entityObjKeysTypes[index],
          value: entityObjKeysValues[index],
        })
    );
  }, [entityObjKeys, entityObjKeysTypes, entityObjKeysValues]);

  /**
   * Adds a default attribute to the attribute list
   */
  const addAttr = () => {
    setAttrList([...attrList, {}]);
  };

  /**
   * Removes the attribute indexed by idx and propagates this removal to
   * every entity object auxiliar mapping structure for name, value and type.
   *
   * @param {Number} idx
   */
  const onRemoveAttr = (idx) => {
    setAttrList(attrList.filter((_, index) => index !== idx));
    setEntityObjKeys(entityObjKeys.filter((_, index) => index != idx));
    setEntityObjKeysValues(
      entityObjKeysValues.filter((_, index) => index != idx)
    );
    setEntityObjKeysTypes(
      entityObjKeysTypes.filter((_, index) => index != idx)
    );
  };

  /**
   * Handle attribute name addition by mapping it into the auxiliar entity object keys list
   *
   * @param {Number} id
   * @param {String} name
   */
  const onAddAttrName = (id, name) => {
    console.log(id, name, entityObjKeys);
    const clone = entityObjKeys;
    clone[id] = name;
    setEntityObjKeys(clone);
  };

  /**
   * Handle attribute type addition by mapping it into the auxiliar entity object keys values list
   *
   * @param {Number} id
   * @param {String} type
   */
  const onAddAttrType = (id, type) => {
    console.log(id, type, entityObjKeysTypes);
    const clone = entityObjKeysTypes;
    clone[id] = type;
    setEntityObjKeysTypes(clone);
  };

  /**
   * Handle attribute value addition by mapping it into the auxiliar entity object keys values list
   *
   * @param {Number} id
   * @param {String} value
   */
  const onAddAttrValue = (id, value) => {
    console.log(id, value, entityObjKeysValues);
    const clone = entityObjKeysValues;
    clone[id] = value;
    setEntityObjKeysValues(clone);
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
            placeholder="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            prefix={<IdcardOutlined />}
          />
          <Input
            size="large"
            placeholder="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            prefix={<TagOutlined />}
          />
          {attrList.map((attr, idx) => (
            <EntityAttribute
              key={`attribute:${idx}`}
              id={idx}
              name={attr.name}
              value={attr.value}
              type={attr.type}
              onRemove={() => onRemoveAttr(idx)}
              onAddName={(id, name) => onAddAttrName(id, name)}
              onAddType={(id, name) => onAddAttrType(id, name)}
              onAddValue={(id, name) => onAddAttrValue(id, name)}
            />
          ))}
          <StyledPlusCircleFilled onClick={addAttr} />
        </Form>
        <ScrollableJsonViewer
          theme={"dark"}
          highlightUpdates={true}
          value={object}
        />
      </ModalContent>
    </StyledModal>
  );
};

export default NewEntityModal;
