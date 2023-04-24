import React, { useEffect } from "react";
import styled from "styled-components";
import ngsiJSService from "../../services/ngsijs";
import { useState } from "react";
import EntityList from "../../components/EntityList";
import NewEntityModal from "../../components/NewEntityModal";
import OnSaveEntityModal from "../../components/OnCreateEntityModal";
import { bgLightBlue } from "../../palette";
import Lottie from "lottie-react";
import loadingAnimation from "../../resources/lotties/loading.json";
import { Empty } from "antd";

const BodyWrapper = styled.div`
  padding: 42px;
  background: ${bgLightBlue};
  height: 100%;
  flex: 1;
`;

const HomePage = () => {
  const [entityList, setEntityList] = useState(null);
  const [getEntityListLoading, setGetEntityListLoading] = useState(false);
  const [showNewEntityModal, setShowNewEntityModal] = useState(false);
  const [onCreateEntityLoading, setOnCreateEntityLoading] = useState(false);
  const [showOnCreateEntityModal, setShowOnCreateEntityModal] = useState(false);
  const [createEntitySuccess, setCreateEntitySuccess] = useState(false);

  /**
   * Fetch entity list whenever the page is mounted
   */
  useEffect(() => {
    handleGetEntityList();
  }, []);

  /**
   * Handle entity list getter by calling ngsiJSService
   */
  const handleGetEntityList = async () => {
    setGetEntityListLoading(true);
    const entityList = await ngsiJSService.getEntityList();
    setEntityList(entityList);
    setGetEntityListLoading(false);
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
          {getEntityListLoading ? (
            <Lottie
              animationData={loadingAnimation}
              style={{ height: "40vh" }}
            />
          ) : (
            <EntityList entityList={entityList} onNewEntity={onNewEntity} />
          )}
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

export default HomePage;
