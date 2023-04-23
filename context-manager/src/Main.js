import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";

const Main = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />}></Route>
    </Routes>
  );
};

export default Main;
