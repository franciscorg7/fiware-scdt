import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home.page.jsx";
import NewVehicle from "./pages/new-vehicle.page.jsx";

const Main = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />}></Route>
      <Route exact path="/new-vehicle" element={<NewVehicle />}></Route>
    </Routes>
  );
};

export default Main;
