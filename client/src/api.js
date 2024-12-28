import axios from "axios";

const API_URL =
  "https://qsi818fou8.execute-api.us-east-1.amazonaws.com/prod/workouts";

//GET ALL WORKOUTS
export const getWorkouts = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {}
};

//CREATE WORKOUT
export const createWorkout = async (workout) => {
  try {
    const response = await axios.post(API_URL, workout);
    return response.data;
  } catch (error) {}
};

//UPDATE WORKOUT
export const updateWorkout = async (workout) => {
  try {
    const response = await axios.put(
      `${API_URL}`,
      workout
    );
    return response.data;
  } catch (error) {
    console.error(`Could not update workout session: ${error.message}`);
  }
};

//DELETE WORKOUT
export const deleteWorkoutSession = async (session_id, user_name) => {
  try {
    const response = await axios.delete(API_URL, {
      data: { session_id, user_name },
    });
    return response.data;
  } catch (error) {}
};
