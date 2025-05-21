import axios from "axios";

const getBaseURL = () => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5001/api";
  }
  return "/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const markAttendance = async ({ name, email, image }) => {
  try {
    const res = await API.post("/attendance", { name, email, image });
    return res.data;
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw error.response?.data?.error || "error in markAttendance";
  }
};

export const registerUser = async ({ name, email, image }) => {
  try {
    const res = await API.post("/register", { name, email, image });
    return res.data;
  } catch (error) {
    console.error("registerUser error:", error);
    throw error;
  }
};

export const fetchAttendance = async () => {
  const res = await API.get("/attendance");
  return res.data;
};
