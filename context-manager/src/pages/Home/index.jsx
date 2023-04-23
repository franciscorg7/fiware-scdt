import React, { useEffect } from "react";
import styled from "styled-components";
import ngsiJSService from "../../services/ngsijs";
import { useState } from "react";
import EntityList from "../../components/EntityList";
import NewEntityModal from "../../components/NewEntityModal";
import OnSaveEntityModal from "../../components/OnSaveEntityModal";
import { bgLightBlue } from "../../palette";
import Lottie from "lottie-react";
import loadingAnimation from "../../resources/lotties/loading.json";

const BodyWrapper = styled.div`
  padding: 42px;
  background: ${bgLightBlue};
  height: 100%;
  flex: 1;
`;

const HomePage = () => {
  const [entityList, setEntityList] = useState([]);
  const [getEntityListLoading, setGetEntityListLoading] = useState(false);
  const [showEntityModal, setShowEntityModal] = useState(false);
  const [showOnSaveEntityModal, setShowOnSaveEntityModal] = useState(false);
  const [onSaveEntityLoading, setOnSaveEntityLoading] = useState(false);

  /**
   * Call /entity/list whenever HomePage renders
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
    setOnSaveEntityLoading(true);
    const response = await ngsiJSService.createEntity(entityObj);
    console.log(response);
    setOnSaveEntityLoading(false);
  };

  /**
   * Sets the modal open flag to true
   */
  const onNewEntity = () => {
    setShowEntityModal(true);
  };

  return (
    <BodyWrapper>
      {getEntityListLoading ? (
        <Lottie animationData={loadingAnimation} style={{ height: "40vh" }} />
      ) : (
        <EntityList entityList={entityList} onNewEntity={onNewEntity} />
      )}
      <NewEntityModal
        show={showEntityModal}
        setShow={setShowEntityModal}
        onSave={handleCreateEntity}
        onSaveLoading={onSaveEntityLoading}
      />
      <OnSaveEntityModal
        show={true}
        setShow={setShowOnSaveEntityModal}
        success={true}
      />
    </BodyWrapper>
  );
};

export default HomePage;
