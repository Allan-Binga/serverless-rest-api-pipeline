import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import GetWorkout from "./pages/getWorkout/getWorkout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workoutapi/workouts" element={<GetWorkout />} />
      </Routes>
    </Router>
  );
};

export default App;
