import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  IdcardOutlined,
  TagOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { Input, Modal, Button } from "antd";
import { JsonViewer } from "@textea/json-viewer";
import EntityAttribute from "../EntityAttribute";
import { highlightOrange, textBlue } from "../../palette";
import { useDebounce } from "../../hooks/useDebounce";

const StyledModal = styled(Modal)`
  max-width: 800px;
  width: auto !important;

  & .ant-modal-content {
    min-height: 500px;

    & .ant-modal-footer{
      position: absolute;
      bottom 0;
      right: 0;
      margin: 24px;
    }
  }
`;
const ModalTitle = styled.span`
  color: ${textBlue};
  font-size: 24px;
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
  padding: 16px;
`;
const StyledPlusCircleFilled = styled(PlusCircleFilled)`
  font-size: 16px;
  color: ${highlightOrange};
`;
const CreateButton = styled(Button)`
  font-weight: bold;
  background-color: ${highlightOrange} !important;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const NewEntityModal = ({ show, setShow, onSave, onSaveLoading }) => {
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [entityObj, setEntityObj] = useState({});

  // entityObjKeysNames is an auxiliar list that helps us mapping entityObj attribute names
  const [entityObjKeysNames, setEntityObjKeysNames] = useState([]);

  // entityObjKeysTypes and entityObjKeysValues are auxiliar lists that helps us mapping each attribute corresponding type and value
  const [entityObjKeysTypes, setEntityObjKeysTypes] = useState([]);
  const [entityObjKeysValues, setEntityObjKeysValues] = useState([]);

  const [attrList, setAttrList] = useState([]);

  // Use 1000ms debouncing to update entity id
  useDebounce(
    () => {
      id && setEntityObj({ ...entityObj, id: id });
    },
    1000,
    [id]
  );

  // Use 1000ms debouncing to update entity type
  useDebounce(
    () => {
      type && setEntityObj({ ...entityObj, type: type });
    },
    1000,
    [type]
  );

  // Listen to id changes, in order to synchronously update entityObj
  useEffect(() => {
    id &&
      setEntityObj((entityObj) => {
        const clone = { ...entityObj };
        clone["id"] = id;
        return clone;
      });
  }, [id]);

  // Listen to type changes, in order to synchronously update entityObj
  useEffect(() => {
    type &&
      setEntityObj((entityObj) => {
        const clone = { ...entityObj };
        clone["type"] = type;
        return clone;
      });
  }, [type]);

  /**
   * Listen to entityObjKeysTypes or entityObjKeysValues changes,
   * in order to synchronously update entityObj proper attribute with those changes.
   */
  useEffect(() => {
    entityObjKeysNames.forEach((objKeyName, index) => {
      const buildAttr = {
        type: entityObjKeysTypes[index] || "",
        value: entityObjKeysValues[index] || "",
      };
      setEntityObj((entityObj) => {
        const clone = { ...entityObj };
        clone[objKeyName] = buildAttr;
        return clone;
      });
    });
  }, [entityObjKeysNames, entityObjKeysTypes, entityObjKeysValues]);

  /**
   * Listen to entityObjKeysNames changes, in order to synchronously update entityObj
   * proper attribute with those changes (if attribute name changes, replace the old one).
   */
  useEffect(() => {
    entityObjKeysNames.forEach((objKeyName, index) => {
      setEntityObj((entityObj) => {
        const clone = { ...entityObj };
        const keys = Object.keys(entityObj);
        if (keys[index] !== objKeyName) {
          clone[keys[index]] = clone[objKeyName];
          delete clone[keys[index]];
        }
        return clone;
      });
    });
  }, [entityObjKeysNames]);

  /**
   * Adds a default attribute to the attribute list
   */
  const addAttr = () => {
    setAttrList([...attrList, {}]);
  };

  /**
   * Remove the attribute indexed by idx and propagate this removal to
   * every entity object auxiliar mapping structure for name, value and type.
   *
   * @param {Number} idx
   */
  const onRemoveAttr = (idx) => {
    setAttrList((attrList) => attrList.filter((_, index) => index !== idx));
    setEntityObj((entityObj) => {
      let clone = { ...entityObj };
      const keys = Object.keys(entityObj);
      keys.length > 1 ? delete clone[keys[idx]] : (clone = {});
      return clone;
    });
    setEntityObjKeysNames((entityObjKeysNames) =>
      entityObjKeysNames.filter((_, index) => index !== idx)
    );
    setEntityObjKeysValues((entityObjKeysValues) =>
      entityObjKeysValues.filter((_, index) => index !== idx)
    );
    setEntityObjKeysTypes((entityObjKeysTypes) =>
      entityObjKeysTypes.filter((_, index) => index !== idx)
    );
  };

  /**
   * Handle attribute name addition by mapping it into the auxiliar entity object keys list
   *
   * @param {Number} id
   * @param {String} name
   */
  const onAddAttrName = (id, name) => {
    setEntityObjKeysNames((entityObjKeysNames) => {
      const clone = [...entityObjKeysNames];
      clone[id] = name;
      return clone;
    });
  };

  /**
   * Handle attribute type addition by mapping it into the auxiliar entity object keys values list
   *
   * @param {Number} id
   * @param {String} type
   */
  const onAddAttrType = (id, type) => {
    setEntityObjKeysTypes((entityObjKeysTypes) => {
      const clone = [...entityObjKeysTypes];
      clone[id] = type;
      return clone;
    });
  };

  /**
   * Handle attribute value addition by mapping it into the auxiliar entity object keys values list
   *
   * @param {Number} id
   * @param {String} value
   */
  const onAddAttrValue = (id, value) => {
    setEntityObjKeysValues((entityObjKeysValues) => {
      const clone = [...entityObjKeysValues];
      clone[id] = value;
      return clone;
    });
  };

  return (
    <StyledModal
      title={<ModalTitle>New entity...</ModalTitle>}
      open={show}
      keyboard
      closable={false}
      confirmLoading={onSaveLoading}
      footer={[
        <CreateButton
          type="primary"
          loading={onSaveLoading}
          onClick={() => onSave(entityObj)}
        >
          Create
        </CreateButton>,
      ]}
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
              key={`attribute:${attr.name}:${idx}`}
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
          value={entityObj}
        />
      </ModalContent>
    </StyledModal>
  );
};

export default NewEntityModal;
