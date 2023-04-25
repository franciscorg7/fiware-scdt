import React, { useEffect } from "react";
import styled from "styled-components";
import ngsiJSService from "../../services/ngsijs";
import { useState } from "react";
import EntityList from "../../components/EntityList";
import NewEntityModal from "../../components/NewEntityModal";
import OnSaveEntityModal from "../../components/OnCreateEntityModal";
import { Empty } from "antd";
import { useLocation } from "react-router-dom";

const BodyWrapper = styled.div`
  padding: 42px;
  height: 100%;
  flex: 1;
`;

const EntityListPage = () => {
  const [entityList, setEntityList] = useState(null);
  const [showNewEntityModal, setShowNewEntityModal] = useState(false);
  const [onCreateEntityLoading, setOnCreateEntityLoading] = useState(false);
  const [showOnCreateEntityModal, setShowOnCreateEntityModal] = useState(false);
  const [createEntitySuccess, setCreateEntitySuccess] = useState(false);

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
    console.log(searchValue);
    searchValue && handleGetEntityList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  /**
   * Handle entity list getter by calling ngsiJSService
   */
  const handleGetEntityList = async () => {
    const entityList = await ngsiJSService.getEntityList({
      ...searchValue,
      noDummies: true,
    });
    setEntityList(entityList);
  };

  /**
   * Handle entity creation by calling ngsiJSService
   * @param {Object} entityObj
   */
  const handleCreateEntity = async (entityObj) => {
    setOnCreateEntityLoading(true);
    ngsiJSService.createEntity(entityObj).then(
      (response) => handleCreateEntitySuccess(),
      (error) => handleCreateEntityError()
    );
    setOnCreateEntityLoading(false);
  };

  /**
   * Propagate createEntity success to modals visibility
   */
  const handleCreateEntitySuccess = () => {
    setCreateEntitySuccess(true);
    setShowNewEntityModal(false);
    setShowOnCreateEntityModal(true);
  };

  /**
   * Propagate createEntity error to modals visibility
   */
  const handleCreateEntityError = () => {
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

  return (
    <>
      {entityList ? (
        <BodyWrapper>
          <EntityList entityList={entityList} onNewEntity={onNewEntity} />
          <NewEntityModal
            show={showNewEntityModal}
            setShow={setShowNewEntityModal}
            onSave={handleCreateEntity}
            onSaveLoading={onCreateEntityLoading}
          />
          <OnSaveEntityModal
            show={showOnCreateEntityModal}
            setShow={setShowOnCreateEntityModal}
            success={createEntitySuccess}
          />
        </BodyWrapper>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default EntityListPage;
