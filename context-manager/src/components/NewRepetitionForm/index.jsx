import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Button,
  notification,
} from "antd";
import { highlightCyan, textBlue } from "../../palette";
import ngsiJSService from "../../services/ngsijs";
import { JsonViewer } from "@textea/json-viewer";
import moment from "moment";
import {
  parseJSONEntities,
  beautifyJSONEntities,
} from "../../services/ngsijs-utils";
import { useDebounce } from "../../hooks/useDebounce";
import { AlignLeftOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const EntitiesModifiedJSONEditor = styled(TextArea)`
  height: 100%;
  resize: none !important;
  & .ant-input {
    resize: none !important;
    white-space: pre;
    font-family: monospace;
  }
`;
const FormItemSpan = styled.span`
  font-weight: bold;
  color: ${textBlue};
`;
const BeautifyButton = styled(Button)`
  font-weight: bold;
  text-align: right;
  font-size: 12px;
  color: ${highlightCyan};
  cursor: pointer;
  padding: 4px 0;

  & :hover {
    color: ${highlightCyan};
  }
`;
const ScrollableJsonViewer = styled(JsonViewer)`
  max-height: 100%;
  overflow: auto;
  padding: 16px;
  flex: 1;
`;
const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  flex: 1;
  & .ant-form-item {
    flex: 1;
    margin-bottom: 0;

    & .ant-row {
      height: 100%;

      & .ant-form-item-control-input {
        height: 100%;

        & .ant-form-item-control-input-content {
          height: 100%;

          & textarea {
            height: 100%;
          }
        }
      }
    }
  }
`;
const FormWrapper = styled(Row)`
  column-gap: 24px;
  height: 90%;
  padding-bottom: 100px;
`;
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;
const BeautifyRow = styled(Row)`
  display: flex;
  justify-content: flex-end;
`;

const NewRepetitionForm = ({
  repType,
  newRepetitionObj,
  setNewRepetitionObj,
}) => {
  const [notifAPI, contextHolder] = notification.useNotification();
  const [repetitionList, setRepetitionList] = useState([]);
  const [pastRepetitionId, setPastRepetitionId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [entitiesModified, setEntitiesModified] = useState([]);
  const [entitiesModifiedStringValue, setEntitiesModifiedStringValue] =
    useState("");
  const [entitiesModifiedInputStatus, setEntitiesModifiedInputStatus] =
    useState("");

  /**
   * Handle entities modified JSON builder changes
   * and propagate them to state with a 400ms debounce ⌛️
   *
   * @param {Event} event
   */
  const onEntitiesModifiedChange = (event) => {
    setEntitiesModifiedStringValue(event.target?.value);
  };

  // Debounce over entitiesModified input ☝🏼
  useDebounce(
    () => {
      const listOfEntitiesParsed = parseJSONEntities(
        entitiesModifiedStringValue
      );
      if (listOfEntitiesParsed) {
        setEntitiesModified(listOfEntitiesParsed);
        setEntitiesModifiedInputStatus("");
      } else {
        setEntitiesModified([]);
        entitiesModifiedStringValue.length === 0
          ? setEntitiesModifiedInputStatus("")
          : setEntitiesModifiedInputStatus("error");
      }
    },
    400,
    [entitiesModifiedStringValue]
  );

  /**
   * Handle start date picker updates and propagate them to state 📆
   *
   * @param {dayjs} date
   */
  const onFromStartChange = (date) => {
    setStartDate(moment(date).format("YYYY-MM-DD HH:mm:ss.SSS"));
  };

  /**
   *  Handle past repetition id updates and propagate them to state 🆔
   * @param {string} id
   */
  const onPastRepetitionIdChange = (id) => {
    setPastRepetitionId(id);
  };

  const onBeautifyEntitiesModified = () => {
    const beautyJSON = beautifyJSONEntities(entitiesModified);
    setEntitiesModifiedStringValue(beautyJSON);
  };

  /**
   * On component render, get the repetition list from ngsiJS proxy 📄
   */
  useMemo(() => {
    ngsiJSService.getRepetitionList().then(
      (results) => {
        const keyedResults = results.map((result, idx) => {
          return { key: idx, value: result.id };
        });
        setRepetitionList(keyedResults);
      },
      (error) => {
        notifAPI["error"]({
          message: <b>{error.message ?? "There was a problem"}</b>,
          description: "Couldn't fetch the repetition list.",
        });
      }
    );
  }, []);

  /**
   * Whenever entitiesModified object gets updated update the current
   * newRepetitionObj with it ⤵️
   */
  useEffect(() => {
    setNewRepetitionObj({
      ...newRepetitionObj,
      entitiesModified: entitiesModified,
    });
  }, [entitiesModified]);

  /**
   * Whenever repetition type changes, form should re-render the form
   * so we need to reset form data 🔄
   */
  useEffect(() => {
    setNewRepetitionObj({ entitiesModified });
    setStartDate(null);
    setPastRepetitionId(null);
  }, [repType]);

  /**
   * Whenever startDate gets updated update the current
   * newRepetitionObj with it 📆
   */
  useMemo(() => {
    startDate &&
      setNewRepetitionObj({
        ...newRepetitionObj,
        startDate: startDate,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  /**
   * Whenever pastRepetitionId gets updated update the current
   * newRepetitionObj with it 🔂
   */
  useMemo(() => {
    pastRepetitionId &&
      setNewRepetitionObj({
        ...newRepetitionObj,
        fromRepetition: pastRepetitionId,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pastRepetitionId]);

  return (
    <>
      {contextHolder}
      {repType === 1 ? (
        <FormWrapper>
          <StyledForm name="new_repetition_1">
            <FormItemSpan>Modified entities</FormItemSpan>
            <BeautifyRow>
              <BeautifyButton
                type="link"
                icon={<AlignLeftOutlined />}
                disabled={entitiesModified.length === 0}
                onClick={onBeautifyEntitiesModified}
              >
                beautify
              </BeautifyButton>
            </BeautifyRow>
            <Form.Item
              validateStatus={entitiesModifiedInputStatus}
              help={
                entitiesModifiedInputStatus === "error" &&
                "Should be a list of JSON objects"
              }
            >
              <EntitiesModifiedJSONEditor
                value={entitiesModifiedStringValue}
                onChange={onEntitiesModifiedChange}
                placeholder="Submit an array with the modified entities."
              />
            </Form.Item>
          </StyledForm>
          <ScrollableJsonViewer
            rootName="newRepetition"
            theme={"dark"}
            highlightUpdates={true}
            value={newRepetitionObj}
          />
        </FormWrapper>
      ) : repType === 2 ? (
        <FormWrapper>
          <StyledForm name="new_repetition_2">
            <FormItemSpan>Repetition ID</FormItemSpan>
            <Form.Item name="repId" style={{ flex: 0, marginBottom: 24 }}>
              <Select
                showSearch
                options={repetitionList}
                value={pastRepetitionId}
                placeholder="Select past repetition"
                onChange={(e) => onPastRepetitionIdChange(e)}
              />
            </Form.Item>
            <FormItemSpan>Modified entities</FormItemSpan>
            <BeautifyRow>
              <BeautifyButton
                type="link"
                icon={<AlignLeftOutlined />}
                disabled={entitiesModified.length === 0}
                onClick={onBeautifyEntitiesModified}
              >
                beautify
              </BeautifyButton>
            </BeautifyRow>
            <Form.Item
              validateStatus={entitiesModifiedInputStatus}
              help={
                entitiesModifiedInputStatus === "error" &&
                "Should be a list of JSON objects"
              }
            >
              <EntitiesModifiedJSONEditor
                value={entitiesModifiedStringValue}
                onChange={onEntitiesModifiedChange}
                placeholder="Submit an array with the modified entities."
              />
            </Form.Item>
          </StyledForm>
          <ScrollableJsonViewer
            rootName="newRepetition"
            theme={"dark"}
            highlightUpdates={true}
            value={newRepetitionObj}
          />
        </FormWrapper>
      ) : repType === 3 ? (
        <FormWrapper>
          <StyledForm name="new_repetition_3">
            <FormItemSpan>From start</FormItemSpan>
            <Form.Item style={{ flex: 0, marginBottom: 24 }} name="fromDate">
              <StyledDatePicker
                value={startDate}
                onChange={onFromStartChange}
              />
            </Form.Item>
            <FormItemSpan>Modified entities</FormItemSpan>
            <BeautifyRow>
              <BeautifyButton
                type="link"
                icon={<AlignLeftOutlined />}
                disabled={entitiesModified.length === 0}
                onClick={onBeautifyEntitiesModified}
              >
                beautify
              </BeautifyButton>
            </BeautifyRow>
            <Form.Item
              validateStatus={entitiesModifiedInputStatus}
              help={
                entitiesModifiedInputStatus === "error" &&
                "Should be a list of JSON objects"
              }
            >
              <EntitiesModifiedJSONEditor
                value={entitiesModifiedStringValue}
                onChange={onEntitiesModifiedChange}
                placeholder="Submit an array with the modified entities."
              />
            </Form.Item>
          </StyledForm>
          <ScrollableJsonViewer
            rootName="newRepetition"
            theme={"dark"}
            highlightUpdates={true}
            value={newRepetitionObj}
          />
        </FormWrapper>
      ) : null}
    </>
  );
};

export default NewRepetitionForm;
