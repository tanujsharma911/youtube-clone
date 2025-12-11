import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER}/api`,
});

export const axiosPrivate = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER ?? ""}/api`,
  withCredentials: true,
});

export default instance;
