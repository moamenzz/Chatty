import axios from "axios";

export const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  withCredentials: true,
});
