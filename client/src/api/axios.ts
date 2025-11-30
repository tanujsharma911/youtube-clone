import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
});

export const axiosPrivate = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default instance;
