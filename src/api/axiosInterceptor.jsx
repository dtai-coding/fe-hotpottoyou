/* eslint-disable no-unused-expressions */
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useAuthStore } from 'src/stores';
import axiosClient from 'src/api/axiosClient';

const AxiosInterceptor = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    /* Request Interceptor */
    const requestInterceptor = (config) => {
      const customHeader = {};

      if (accessToken) {
        customHeader.Authorization = `Bearer ${accessToken}`;
      }

      return {
        ...config,
        headers: {
          ...customHeader,
          ...config.headers,
        },
      };
    };

    const requestErrorInterceptor = (error) => Promise.reject(error);

    /* Response Interceptor */
    const responseInterceptor = (response) => response?.data || {};

    const responseErrorInterceptor = async (error) => {
      /**
       * Add logic for any error from backend
       */

      if (error.response && error.response.data.data) {
        return Promise.reject(error.response.data.data.join(', '));
      }
      if (error.response && error.response.data.message) {
        return Promise.reject(error.response.data.message);
      }
      if (error.message) {
        return Promise.reject(error.message);
      }
      return Promise.reject(new Error('Có lỗi bất ngờ xảy ra !!!'));
    };

    const interceptorReq = axiosClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
    const interceptorRes = axiosClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

    return () => {
      axiosClient.interceptors.request.eject(interceptorReq);
      axiosClient.interceptors.response.eject(interceptorRes);
    };
  }, [accessToken]);

  return <Outlet />;
};
export default AxiosInterceptor;
