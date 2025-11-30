import { axiosPrivate } from "@/api/axios";
import useAuth from "@/store/auth";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { user } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // Add Authorization header if not already present
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user?.data?.accessToken}`;
          console.log(
            "Added Authorization header to request",
            `Bearer ${user?.data?.accessToken}`
          );
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          const newUserData = await refresh();

          if (newUserData) {
            prevRequest.headers[
              "Authorization"
            ] = `Bearer ${newUserData.token}`;
            return axiosPrivate(prevRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [user, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
