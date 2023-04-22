import React, { useEffect } from "react";
import styled from "styled-components";
import ngsijs from "../../services/ngsijs";
import { useState } from "react";
import EntityList from "../../components/EntityList";
import NewEntityModal from "../../components/NewEntityModal";

const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
`;
const TitleWrapper = styled.div`
  width: 100%;
  font-size: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
const BodyWrapper = styled.div``;

const HomePage = () => {
  const [entityList, setEntityList] = useState([]);
  const [showEntityModal, setShowEntityModal] = useState(false);
  const [onSaveEntityLoading, setOnSaveEntityLoading] = useState(false);

  useEffect(() => {
    ngsijs.get(`/entity/list`).then((res) => {
      console.log(res.data.data.results);
      setEntityList(res.data.data.results);
    });
  }, []);

  const onNewEntity = () => {
    setShowEntityModal(true);
  };

  const onSaveNewEntity = () => {};

  return (
    <PageWrapper>
      <TitleWrapper>
        <h1>FIWARE Context Consumer</h1>
      </TitleWrapper>
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
