import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import EntityPage from "./pages/Entity";

const Main = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route path="/entity/:id" element={<EntityPage />} />
    </Routes>
  );
};

export default Main;
