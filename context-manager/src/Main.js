import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import EntityPage from "./pages/Entity";
import EntityListPage from "./pages/EntityList";

const Main = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/entity/list" element={<EntityListPage />} />
      <Route path="/entity/:id" element={<EntityPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Main;
