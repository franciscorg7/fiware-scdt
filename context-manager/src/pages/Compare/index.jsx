import React, { useState } from "react";
import { Row, Col, Empty, Collapse } from "antd";
import styled from "styled-components";
import { textBlue } from "../../palette";
import CompareCard from "../../components/CompareCard";
import CompareEntitySearch from "../../components/CompareEntitySearch";
import { useMemo } from "react";
import ngsiJSService from "../../services/ngsijs";
import { FilterFilled } from "@ant-design/icons";

const { Panel } = Collapse;
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
  & .ant-collapse-header-text {
    font-weight: bold;
    color: ${textBlue};
  }
`;

const ComparePage = () => {
  const [comparingEntityIds, setComparingEntityIds] = useState([]);
  const [comparingEntitySet, setComparingEntitySet] = useState([]);

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
        <FiltersCollapse ghost expandIcon={() => <FilterFilled />}>
          <Panel header="Filters">
            <p>hello</p>
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
