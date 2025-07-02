import axios from "axios";

export const axiosPublic = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});
