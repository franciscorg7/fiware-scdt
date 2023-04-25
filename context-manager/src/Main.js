import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import EntityPage from "./pages/Entity";
import EntityListPage from "./pages/EntityList";
import RepetitionListPage from "./pages/RepetitionList";
import ComparePage from "./pages/Compare";
import SubscriptionListPage from "./pages/SubscriptionList";

const Main = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/entity/list" element={<EntityListPage />} />
      <Route exact path="/repetition/list" element={<RepetitionListPage />} />
      <Route exact path="/compare" element={<ComparePage />} />
      <Route
        exact
        path="/subscription/list"
        element={<SubscriptionListPage />}
      />
      <Route path="/entity/:id" element={<EntityPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Main;
