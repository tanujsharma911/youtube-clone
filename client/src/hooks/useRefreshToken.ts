import axios from "../api/axios";
import useAuth from "@/store/auth";

const useRefreshToken = () => {
  const { user, login } = useAuth();

  const refreshToken = async () => {
    try {
      const response = await axios.get("/users/refresh-token", {
        withCredentials: true,
      });

      const userData = response.data;

      console.log("Refreshed user data:", userData);
      console.log("useAuth user data:", user);

      login(userData);

      return userData;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };

  return refreshToken;
};

export default useRefreshToken;
