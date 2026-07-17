import axios from 'axios';
import config, { apiHost } from './constants';

const apiClient = axios.create({
  baseURL: apiHost,  
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: function (status) {
    return status !== 403;
  }
});

async function refresh(): Promise<boolean> {
  const result = await apiClient.post(config.api.refresh, {},
    {
      params: { 
        'refresh_token': localStorage.getItem(config.constants.refreshTokenLSKey)
      }
    });

  if (result?.data?.success) {
    localStorage.setItem(config.constants.accessTokenLSKey, result?.data?.access_token);
    localStorage.setItem(config.constants.refreshTokenLSKey, result?.data?.refresh_token);
    return true
  }

  return false;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 403 && originalRequest.url !== config.api.refresh) {
      if (await refresh()) {
        originalRequest.headers['access-token'] = localStorage.getItem(config.constants.accessTokenLSKey);
        originalRequest.headers['refresh-token'] = localStorage.getItem(config.constants.refreshTokenLSKey);
        return apiClient.request(error.config);
      }
      else
        window.location.href = '/signin';
    }

    return Promise.reject(error);
  }
);

export default apiClient;