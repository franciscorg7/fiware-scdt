import React, { useEffect } from "react";
import styled from "styled-components";
import ngsijs from "../../services/ngsijs";
import { useState } from "react";
import EntityList from "../../components/EntityList";
import NewEntityModal from "../../components/NewEntityModal";
import { bgLightBlue } from "../../palette";
import Navbar from "../../components/Navbar";

const PageWrapper = styled.div`
  height: 100vh;
`;
const BodyWrapper = styled.div`
  padding: 42px;
  background: ${bgLightBlue};
  height: 100%;
`;

const HomePage = () => {
  const [entityList, setEntityList] = useState([]);
  const [showEntityModal, setShowEntityModal] = useState(false);
  const [onSaveEntityLoading, setOnSaveEntityLoading] = useState(false);

  /**
   * Call /entity/list whenever HomePage renders
   */
  useEffect(() => {
    ngsijs.get(`/entity/list`).then((res) => {
      setEntityList(res.data.data.results);
    });
  }, []);

  /**
   * Sets the modal open flag to true
   */
  const onNewEntity = () => {
    setShowEntityModal(true);
  };

  const onSaveNewEntity = () => {};

  return (
    <PageWrapper>
      <Navbar />
      <BodyWrapper>
        <EntityList entityList={entityList} onNewEntity={onNewEntity} />
      </BodyWrapper>
      <NewEntityModal
        show={showEntityModal}
        setShow={setShowEntityModal}
        onSave={onSaveNewEntity}
        onSaveLoading={onSaveEntityLoading}
      />
    </PageWrapper>
  );
};

export default HomePage;
