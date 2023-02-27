import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button } from "antd";

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
const ActionsWrapper = styled.div``;
const StyledButton = styled(Button)`
  font-weight: bold;
`;
const Home = () => {
  return (
    <PageWrapper>
      <TitleWrapper>
        <h1>FIWARE Context Consumer</h1>
      </TitleWrapper>
      <BodyWrapper>
        <ActionsWrapper>
          <Link to="/new-vehicle">
            <StyledButton>Register Vehicle</StyledButton>
          </Link>
        </ActionsWrapper>
      </BodyWrapper>
    </PageWrapper>
  );
};

export default Home;
