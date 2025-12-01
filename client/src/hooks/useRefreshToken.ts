import axios from "../api/axios";
import useAuth from "@/store/auth";

const useRefreshToken = () => {
  const { login } = useAuth();

  const refreshToken = async () => {
    try {
      const response = await axios.post("/users/refresh-token");

      const userData = response.data;

      login(userData.data);

      return userData;
    } catch (error) {
      console.log(
        "👉 useRefreshToken :: Failed to refresh token -> because of first visit",
        error
      );
      // console.error("Failed to refresh token -> because first visit", error);
      return null;
    }
  };

  return refreshToken;
};

export default useRefreshToken;
