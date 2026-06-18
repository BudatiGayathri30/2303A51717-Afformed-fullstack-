import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { logger } from '../shared/logger/logger';

interface RetriableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

function describeRequest(config: AxiosRequestConfig): string {
  const method = (config.method ?? 'get').toUpperCase();
  const url = `${config.baseURL ?? env.apiBaseUrl}${config.url ?? ''}`;
  return `${method} ${url}`;
}

const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const requestDescription = describeRequest(config);
  logger.info('api', `Request started: ${requestDescription}`);

  const token = env.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    logger.info('api', `Request succeeded with status ${response.status}`);
    return response;
  },
  async (error: AxiosError) => {
    const requestConfig = error.config as RetriableRequestConfig | undefined;
    const responseStatus = error.response?.status;
    const errorMessage = error.message || 'Request failed';

    logger.error('api', errorMessage);

    if (requestConfig && responseStatus && responseStatus >= 500 && responseStatus < 600 && !requestConfig._retry) {
      requestConfig._retry = true;
      return axiosClient.request(requestConfig);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
