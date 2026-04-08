import type { AxiosInstance } from 'axios';
import axios from 'axios';

import { useAuthStore } from '@/stores/auth.store';
import { ENV } from '@/constants';

const baseURL = ENV.BASE_URL;

const instance = axios.create({
  baseURL,
  headers: {
    'content-type': 'application/json',
  },
  responseType: 'json',
});

const createAxiosRequestInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    config => {
      const { accessToken } = useAuthStore.getState();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => error
  );
};

const createAxiosResponseInterceptor = (axiosInstance: AxiosInstance) => {
  const interceptor = axiosInstance.interceptors.response.use(
    response => response,
    error => {
      // Reject promise if usual error
      if (error.status >= 500) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
      if (error.status !== 401) {
        return Promise.reject(error);
      }
      /*
       * When response code is 401, try to refresh the token.
       * Eject the interceptor so it doesn't loop in case
       * token refresh causes the 401 response
       */
      axiosInstance.interceptors.response.eject(interceptor);

      const { accessToken, refreshToken } = useAuthStore.getState();
      if (typeof accessToken === 'undefined' || typeof refreshToken === 'undefined') {
        useAuthStore.getState().logout();
        return Promise.reject();
      }

      const postUrl = `${baseURL}/refresh-token`;

      return axiosInstance
        .post(postUrl, {
          refresh_token: refreshToken,
        })
        .then(response => {
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken; // Update refresh token if it rotates
          useAuthStore.setState({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
          error.response.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(error.response.config);
        })
        .catch(error => {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        });
    }
  );
};

createAxiosRequestInterceptor(instance);
createAxiosResponseInterceptor(instance);

export default instance;
