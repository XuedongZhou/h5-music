import axios, { type AxiosRequestConfig } from 'axios';

const request = axios.create({
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  },
  timeout: 60000,
  baseURL: '/music-api'
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error(error);
  },
  {
    runWhen: () => true
  }
);

request.interceptors.response.use(
  (response) => {
    const { status } = response;
    if (status === 200 || status < 300 || status === 304) {
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  },
  (error) => {
    console.error(error);
  },
  {
    runWhen: () => true
  }
);

export const http = async <T>(config: AxiosRequestConfig) => {
  try {
    const res = await request<T>(config);
    return Promise.resolve(res.data);
  } catch (error) {
    return Promise.reject(error);
  }
};
