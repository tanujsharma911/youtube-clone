import axios from "axios";

const instance = axios.create({
  baseURL: "https://youtube-clone-7ozu.onrender.com/api",
});

export const axiosPrivate = axios.create({
  baseURL: "https://youtube-clone-7ozu.onrender.com/api",
  withCredentials: true,
});

export default instance;
