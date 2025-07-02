import { axiosPrivate, axiosPublic } from "../lib/axiosInstances";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";

const useAxiosPrivate = () => {
  const { accessToken, setAccessToken } = useAuthStore();
  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,

      async (error) => {
        const originalRequest = error?.config;

        if (error?.response?.status === 401 && !originalRequest?.sent) {
          originalRequest.sent = true;

          const response = await axiosPublic.get("/auth/refresh");
          const newAccessToken = response.data;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          setAccessToken(newAccessToken);
          // console.log(originalRequest.headers);
          return axiosPrivate(originalRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, setAccessToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;
