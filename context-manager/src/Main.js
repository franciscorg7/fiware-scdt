import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import NewEntityPage from "./pages/NewEntity";

const Main = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />}></Route>
      <Route exact path="/new-entity" element={<NewEntityPage />}></Route>
    </Routes>
  );
};

export default Main;
