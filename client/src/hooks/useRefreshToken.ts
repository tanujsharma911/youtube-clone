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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      console.log("👉 Failed to refresh token -> because of first visit");
      return null;
    }
  };

  return refreshToken;
};

export default useRefreshToken;
