import React, { useEffect, useState } from "react";
import { getWorkouts } from "../../api";
import "./workout.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const GetWorkout = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const workoutData = await getWorkouts();
        setWorkouts(workoutData);
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    };
    fetchWorkouts();
  }, []);
  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrapper">
        <div className="content">
          <h1 className="workouts-title">Workouts</h1>
          {/* <button
            className="add-workout-button"
            //  onClick={() => navigate("/workouts/add")}
          >
            Add workout
          </button> */}
          {workouts.map((workout) => {
            console.log("Workout:", workout); // Debug each workout object
            return (
              <div className="workout-card" key={workout.SessionId}>
                <h2 className="workout-username">{workout.UserName}</h2>
                <h2 className="workout-status">
                  {workout.OrderStatus ||
                    workout.SessionStatus ||
                    "Unknown Status"}
                </h2>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GetWorkout;
