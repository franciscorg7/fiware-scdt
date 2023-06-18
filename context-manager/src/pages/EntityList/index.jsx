import React, { useEffect } from "react";
import styled from "styled-components";
import ngsiJSService from "../../services/ngsijs";
import { useState } from "react";
import EntityList from "../../components/EntityList";
import NewEntityModal from "../../components/NewEntityModal";
import OnCreateEntityModal from "../../components/OnCreateEntityModal";
import { Row, notification } from "antd";
import ActionFloatButton from "../../components/ActionFloatButton";
import { useLocation } from "react-router-dom";
import { textBlue } from "../../palette";

const BodyWrapper = styled.div`
  padding: 42px;
  height: 100%;
  flex: 1;
`;
const Title = styled(Row)`
  align-items: center;
  column-gap: 8px;
  & h1 {
    color: ${textBlue};
  }
  & .ant-tag {
    height: fit-content;
  }
`;
const LoadMoreWrapper = styled(Row)`
  justify-content: center;
  padding: 20px 0;

  & span {
    cursor: pointer;
  }
`;

const EntityListPage = () => {
  const DEFAULT_LOAD_COUNT = 12;
  const [entityList, setEntityList] = useState([]);
  const [showNewEntityModal, setShowNewEntityModal] = useState(false);
  const [onCreateEntityLoading, setOnCreateEntityLoading] = useState(false);
  const [showOnCreateEntityModal, setShowOnCreateEntityModal] = useState(false);
  const [createEntityResponse, setCreateEntityResponse] = useState(null);
  const [createEntitySuccess, setCreateEntitySuccess] = useState(false);
  const [resultsLimit, setResultsLimit] = useState(DEFAULT_LOAD_COUNT);

  const [notifAPI, contextHolder] = notification.useNotification();

  // Get current search value from the Navbar
  const searchValue = useLocation().state;

  /**
   * Fetch entity list whenever the page is mounted
   */
  useEffect(() => {
    handleGetEntityList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Listen to searchValue changes in order to update entity list
   */
  useEffect(() => {
    searchValue && handleGetEntityList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  /**
   * Handle entity list getter by calling ngsiJSService
   */
  const handleGetEntityList = async () => {
    ngsiJSService
      .getEntityList({
        ...searchValue,
        noDummies: true,
      })
      .then(
        (results) => {
          setEntityList(results);
        },
        (error) => {
          notifAPI["error"]({
            message: <b>{error.message ?? "There was a problem"}</b>,
            description: "Couldn't fetch the entity list.",
          });
        }
      );
  };

  /**
   * Handle entity creation by calling ngsiJSService
   * @param {Object} entityObj
   */
  const handleCreateEntity = async (entityObj) => {
    setOnCreateEntityLoading(true);
    ngsiJSService.createEntity(entityObj).then(
      (response) => handleCreateEntitySuccess(response),
      (error) => handleCreateEntityError(error)
    );
    setOnCreateEntityLoading(false);
  };

  /**
   * Propagate createEntity success to modals visibility
   */
  const handleCreateEntitySuccess = (response) => {
    setCreateEntityResponse(response);
    setCreateEntitySuccess(true);
    setShowNewEntityModal(false);
    setShowOnCreateEntityModal(true);
  };

  /**
   * Propagate createEntity error to modals visibility
   */
  const handleCreateEntityError = (error) => {
    setCreateEntityResponse(error);
    setCreateEntitySuccess(false);
    setShowNewEntityModal(false);
    setShowOnCreateEntityModal(true);
  };

  /**
   * Sets the modal open flag to true
   */
  const onNewEntity = () => {
    setShowNewEntityModal(true);
  };

  /**
   * Shows more DEFAULT_LOAD_COUNT entities
   */
  const loadMore = (count) => {
    setResultsLimit(Math.min(resultsLimit + count, entityList.length));
  };

  return (
    <>
      {contextHolder}
      <BodyWrapper>
        <Title>
          <h1>Entities</h1>
        </Title>
        <EntityList
          entityList={entityList?.slice(0, resultsLimit)}
          onNewEntity={onNewEntity}
        />
        {resultsLimit !== entityList.length ? (
          <LoadMoreWrapper>
            <span onClick={() => loadMore(DEFAULT_LOAD_COUNT)}>Load more</span>
          </LoadMoreWrapper>
        ) : null}
        {showNewEntityModal ? (
          <NewEntityModal
            show={showNewEntityModal}
            setShow={setShowNewEntityModal}
            onSave={handleCreateEntity}
            onSaveLoading={onCreateEntityLoading}
          />
        ) : null}
        <OnCreateEntityModal
          show={showOnCreateEntityModal}
          setShow={setShowOnCreateEntityModal}
          result={createEntityResponse}
          success={createEntitySuccess}
        />
        <ActionFloatButton
          onAction={onNewEntity}
          actionLabel="New entity"
        ></ActionFloatButton>
      </BodyWrapper>
    </>
  );
};

export default EntityListPage;
