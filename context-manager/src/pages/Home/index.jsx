import React, { useEffect } from "react";
import styled from "styled-components";
import ngsiJSService from "../../services/ngsijs";
import { useState } from "react";
import EntityList from "../../components/EntityList";
import NewEntityModal from "../../components/NewEntityModal";
import { bgLightBlue } from "../../palette";

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
  const [onSaveEntityLoading, setOnSaveEntityLoading] = useState(false);

  /**
   * Call /entity/list whenever HomePage renders
   */
  useEffect(() => {
    handleGetEntityList();
  }, []);

  /**
   *
   */
  const handleGetEntityList = async () => {
    setGetEntityListLoading(true);
    const entityList = await ngsiJSService.getEntityList();
    setEntityList(entityList);
    setGetEntityListLoading(false);
  };

  useEffect(() => {
    console.log(getEntityListLoading);
  }, [getEntityListLoading]);

  /**
   * Sets the modal open flag to true
   */
  const onNewEntity = () => {
    setShowEntityModal(true);
  };

  const onSaveNewEntity = (entityObj) => {};

  return (
    <BodyWrapper>
      <EntityList entityList={entityList} onNewEntity={onNewEntity} />
      <NewEntityModal
        show={showEntityModal}
        setShow={setShowEntityModal}
        onSave={onSaveNewEntity}
        onSaveLoading={onSaveEntityLoading}
      />
    </BodyWrapper>
  );
};

export default HomePage;
