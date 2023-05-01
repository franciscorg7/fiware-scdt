import React, { useState, useEffect } from "react";
import { Row, Col, Empty, Collapse, DatePicker, Select } from "antd";
import styled from "styled-components";
import { textBlue } from "../../palette";
import CompareCard from "../../components/CompareCard";
import CompareEntitySearch from "../../components/CompareEntitySearch";
import { useMemo } from "react";
import ngsiJSService from "../../services/ngsijs";
import { FilterFilled, FilterOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const BodyWrapper = styled(Col)`
  padding: 42px;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
`;
const EntityTitle = styled(Row)`
  align-items: center;
  column-gap: 8px;
  & h1 {
    color: ${textBlue};
  }
  & .ant-tag {
    height: fit-content;
  }
`;
const ComparingContainer = styled(Col)`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 42px;
`;
const EntitySearchRow = styled(Row)`
  width: 100%;
`;
const SearchWrapper = styled(Col)`
  justify-content: center;
  display: flex;
  flex: 1;
`;
const EntityCardsRow = styled(Row)`
  width: 100%;
  flex: 1;
  align-items: flex-start;
`;
const EntityCardWrapper = styled(Col)`
  display: flex;
  justify-content: center;
  width: 50%;
`;
const StyledEmpty = styled(Empty)`
  width: 100%;
  margin-top: 10rem;
`;
const FiltersCollapse = styled(Collapse)`
  padding: 24px 0;
  & .ant-collapse-header-text {
    font-weight: ${(props) => (!props.disabled ? "bold" : "regular")};
    color: ${(props) => (!props.disabled ? textBlue : "rgba(0, 0, 0, 0.25)")};
  }
  & .ant-collapse-content-box {
    display: flex;
    column-gap: 24px;
    justify-content: flex-end;
  }

  & .ant-collapse-header-text {
    display: flex;
    justify-content: flex-end;
  }
`;
const FilterWrapper = styled(Col)`
  display: flex;
  flex-direction: column;
`;
const AttributeSelect = styled(Select)`
  min-width: 200px;
`;

const ComparePage = () => {
  const [collapseFilters, setCollapseFilters] = useState(true);
  const [comparingEntityIds, setComparingEntityIds] = useState([]);
  const [comparingEntitySet, setComparingEntitySet] = useState([]);
  const [attributeNameOptions, setAttributeNameOptions] = useState([]);
  const [attributeNameFilters, setAttributeNameFilters] = useState([]);
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);

  /**
   * Each time the first entity to be compared gets selected,
   * fetch its dummy historical data
   */
  useMemo(() => {
    if (comparingEntityIds[0]) {
      ngsiJSService.getEntityHistory(`${comparingEntityIds[0]}:dummy`).then(
        (results) => {
          const currentEntitySet = [...comparingEntitySet];
          currentEntitySet[0] = { results: results };
          setComparingEntitySet(currentEntitySet);
        },
        (error) => {
          //TODO: handle error
        }
      );
    } else {
      const currentEntitySet = [...comparingEntitySet];
      currentEntitySet[0] = null;
      setComparingEntitySet(currentEntitySet);
    }
  }, [comparingEntityIds[0]]);

  /**
   * Each time the second entity to be compared gets selected,
   * fetch its dummy historical data
   */
  useMemo(() => {
    if (comparingEntityIds[1]) {
      ngsiJSService.getEntityHistory(`${comparingEntityIds[1]}:dummy`).then(
        (results) => {
          const currentEntitySet = [...comparingEntitySet];
          currentEntitySet[1] = { results: results };
          setComparingEntitySet(currentEntitySet);
        },
        (error) => {
          //TODO: handle error
        }
      );
    } else {
      const currentEntitySet = [...comparingEntitySet];
      currentEntitySet[1] = null;
      setComparingEntitySet(currentEntitySet);
    }
  }, [comparingEntityIds[1]]);

  /**
   * Each time the filters get updated, fetch filtered history for both components
   */
  useMemo(() => {
    // Prepare options for filtering entity history
    let options = [];
    attributeNameFilters &&
      attributeNameFilters.map((attr) => options.push({ attrName: attr }));
    startDateFilter && options.push({ startDate: startDateFilter });
    endDateFilter && options.push({ endDate: endDateFilter });

    let currentEntitySet = [...comparingEntitySet];

    // Fetch filtered history for first component
    comparingEntityIds[0] &&
      ngsiJSService
        .getEntityHistory(`${comparingEntityIds[0]}:dummy`, options)
        .then(
          (results) => {
            currentEntitySet[0] = { results: results };
            // Fetch filtered history for second component
            comparingEntityIds[1] &&
              ngsiJSService
                .getEntityHistory(`${comparingEntityIds[1]}:dummy`, options)
                .then(
                  (results) => {
                    currentEntitySet[1] = { results: results };
                    setComparingEntitySet(currentEntitySet);
                  },
                  (error) => {
                    //TODO: handle error
                  }
                );
          },
          (error) => {
            //TODO: handle error
          }
        );
  }, [attributeNameFilters, startDateFilter, endDateFilter]);

  /**
   * Handle component selection for comparing by updating
   * state with comparing entity ids
   *
   * @param {Number} side // 1 - left, 2 - right
   * @param {string} value
   */
  const handleSelection = (side, entityId) => {
    if (entityId) {
      const modifiedComparingIds = [...comparingEntityIds];
      side === 1
        ? (modifiedComparingIds[0] = entityId)
        : (modifiedComparingIds[1] = entityId);
      setComparingEntityIds(modifiedComparingIds);
    }
  };

  /**
   * Handle component selection clear by removing component
   * from state
   *
   * @param {Number} side // 1 - left, 2 - right
   */
  const handleSelectionClear = (side) => {
    const modifiedComparingIds = [...comparingEntityIds];
    side === 1
      ? (modifiedComparingIds[0] = null)
      : (modifiedComparingIds[1] = null);
    setComparingEntityIds(modifiedComparingIds);
  };

  /**
   * Handle attribute filter changes to update the comparison state
   *
   * @param {string[]} value
   */
  const handleAttributeChange = (value) => {
    setAttributeNameFilters(value);
  };

  /**
   * Handle date range filter changes to update the comparison state
   *
   * @param {dayjs[]} dates
   */
  const handleRangeChange = (dates) => {
    setStartDateFilter(dates ? dates[0].format("YYYY-MM-DD") : null);
    setEndDateFilter(dates ? dates[1].format("YYYY-MM-DD") : null);
  };

  return (
    <BodyWrapper>
      <EntityTitle>
        <h1>Compare</h1>
      </EntityTitle>
      <ComparingContainer>
        <EntitySearchRow>
          <SearchWrapper>
            <CompareEntitySearch
              onChange={(value) => handleSelection(1, value)}
              onClear={() => handleSelectionClear(1)}
            />
          </SearchWrapper>
          <SearchWrapper>
            <CompareEntitySearch
              onChange={(value) => handleSelection(2, value)}
              onClear={() => handleSelectionClear(2)}
            />
          </SearchWrapper>
        </EntitySearchRow>
        <FiltersCollapse
          expandIconPosition="end"
          disabled={!(comparingEntityIds[0] && comparingEntityIds[1])}
          collapsible={
            !(comparingEntityIds[0] && comparingEntityIds[1]) && "disabled"
          }
          activeKey={
            !(comparingEntityIds[0] && comparingEntityIds[1]) || collapseFilters
              ? "-1"
              : "1"
          }
          ghost
          expandIcon={() =>
            collapseFilters ? <FilterOutlined /> : <FilterFilled />
          }
          onChange={() => setCollapseFilters(!collapseFilters)}
        >
          <Panel key="1" header="Filters">
            <FilterWrapper>
              <span>Attributes</span>
              <AttributeSelect
                mode="tags"
                tokenSeparators={[","]}
                onChange={handleAttributeChange}
                options={attributeNameOptions}
              />
            </FilterWrapper>
            <FilterWrapper>
              <span>Date Interval</span>
              <RangePicker
                allowEmpty
                format={"DD MMM YYYY"}
                onChange={handleRangeChange}
              />
            </FilterWrapper>
          </Panel>
        </FiltersCollapse>
        <EntityCardsRow>
          {comparingEntitySet.map(
            (entityData, idx) =>
              entityData && (
                <EntityCardWrapper key={`${comparingEntityIds[idx]}:${idx}`}>
                  <CompareCard
                    entityId={comparingEntityIds[idx]}
                    entityData={entityData.results}
                  />
                </EntityCardWrapper>
              )
          )}
          {comparingEntitySet.length === 0 ||
          !(comparingEntitySet[0] || comparingEntitySet[1]) ? (
            <StyledEmpty description="Compare repetitions history." />
          ) : null}
        </EntityCardsRow>
      </ComparingContainer>
    </BodyWrapper>
  );
};

export default ComparePage;
