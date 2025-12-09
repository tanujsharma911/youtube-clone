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
        // Don't set Content-Type for FormData, let browser handle it
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config; // Original request

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          // Unauthorized on first try
          console.log(
            "👉 First response :: unauthorized error -> trying to refresh token"
          );
          prevRequest.sent = true; // Mark first request as sent

          const newUserData = await refresh(); // Try to refresh token

          if (newUserData) {
            console.log(
              "👉 Second response :: Token refreshed -> retrying original request"
            );
            // Retry original request with new token
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
