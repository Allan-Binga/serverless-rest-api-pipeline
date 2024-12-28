import React from "react";
import "./navbar.css";
import logo from "../navbar/logo.jpg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="logo" />
        <span>Workout API</span>
      </div>
      <div className="nav-links">
        <Link to="/workoutapi/workouts" className="nav-link">
          GetWorkouts
        </Link>
        <Link to="/workoutapi/workouts" className="nav-link">
          GetWorkouts
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
