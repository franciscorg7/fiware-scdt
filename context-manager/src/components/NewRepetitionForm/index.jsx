import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { Form, Input, Select, DatePicker, Row } from "antd";
import { textBlue } from "../../palette";
import ngsiJSService from "../../services/ngsijs";
import { JsonViewer } from "@textea/json-viewer";
import moment from "moment";

const { TextArea } = Input;
const EntitiesModifiedJSONEditor = styled(TextArea)`
  height: 120px;
  resize: none !important;
  & .ant-input {
    resize: none !important;
  }
`;
const FormItemSpan = styled.span`
  font-weight: bold;
  color: ${textBlue};
`;
const ScrollableJsonViewer = styled(JsonViewer)`
  max-height: 600px;
  overflow: auto;
  padding: 16px;
  flex: 1;
`;
const StyledForm = styled(Form)`
  flex: 1;
`;
const FormWrapper = styled(Row)`
  column-gap: 24px;
`;

const NewRepetitionForm = ({ repType, onStart }) => {
  const [repetitionList, setRepetitionList] = useState([]);
  const [pastRepetitionId, setPastRepetitionId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [newRepetitionObj, setNewRepetitionObj] = useState({});

  /**
   * Handle entities modified JSON builder changes
   * and propagate them to state
   *
   * @param {Event} e
   */
  const onEntitiesModifiedChange = (e) => {};

  /**
   * Handle start date picker updates and propagate them to state
   *
   * @param {dayjs} date
   */
  const onFromStartChange = (date) => {
    setStartDate(moment(date).format("YYYY-MM-DD HH:mm:ss.SSS"));
  };

  /**
   *  Handle past repetition id updates and propagate them to state
   * @param {string} id
   */
  const onPastRepetitionIdChange = (id) => {
    setPastRepetitionId(id);
  };

  /**
   * Whenever repetition type changes, form should re-render the form
   * so we need to reset form data
   */
  useMemo(() => {
    if (repType) setNewRepetitionObj({});
  }, [repType]);

  useMemo(() => {
    startDate &&
      setNewRepetitionObj({
        ...newRepetitionObj,
        startDate: startDate,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  useMemo(() => {
    pastRepetitionId &&
      setNewRepetitionObj({
        ...newRepetitionObj,
        fromRepetition: pastRepetitionId,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pastRepetitionId]);

  useMemo(() => {
    ngsiJSService.getRepetitionList().then(
      (results) => {
        const keyedResults = results.map((result, idx) => {
          return { key: idx, value: result.id };
        });
        setRepetitionList(keyedResults);
      },
      (error) => {
        // TODO: deal with error
      }
    );
  }, []);

  return (
    <>
      {repType === 1 ? (
        <FormWrapper>
          <StyledForm name="new_repetition_1">
            <FormItemSpan>Modified entities</FormItemSpan>
            <Form.Item name="entities_modified_1">
              <EntitiesModifiedJSONEditor
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
            <Form.Item name="repId">
              <Select
                showSearch
                options={repetitionList}
                value={pastRepetitionId}
                onChange={(e) => onPastRepetitionIdChange(e)}
              />
            </Form.Item>
            <FormItemSpan>Modified entities</FormItemSpan>
            <Form.Item>
              <EntitiesModifiedJSONEditor
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
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <DatePicker value={startDate} onChange={onFromStartChange} />
            </Form.Item>
            <FormItemSpan>Modified entities</FormItemSpan>
            <Form.Item>
              <EntitiesModifiedJSONEditor
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
