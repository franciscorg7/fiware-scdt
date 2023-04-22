import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home.page.jsx";
import NewEntityPage from "./pages/new-entity.page.jsx";

const Main = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />}></Route>
      <Route exact path="/new-entity" element={<NewEntityPage />}></Route>
    </Routes>
  );
};

export default Main;
