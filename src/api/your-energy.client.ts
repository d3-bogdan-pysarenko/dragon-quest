import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const yourEnergyApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let activeRequests = 0;
let loadingListener: ((isLoading: boolean) => void) | null = null;

export const setApiLoadingListener = (
  listener: ((isLoading: boolean) => void) | null
): void => {
  loadingListener = listener;
  loadingListener?.(activeRequests > 0);
};

const startRequest = (): void => {
  activeRequests += 1;
  loadingListener?.(true);
};

const finishRequest = (): void => {
  activeRequests = Math.max(activeRequests - 1, 0);

  if (activeRequests === 0) {
    loadingListener?.(false);
  }
};

yourEnergyApi.interceptors.request.use(
  config => {
    startRequest();
    return config;
  },
  error => {
    finishRequest();
    return Promise.reject(error);
  }
);

yourEnergyApi.interceptors.response.use(
  response => {
    finishRequest();
    return response;
  },
  error => {
    finishRequest();
    return Promise.reject(error);
  }
);

export const buildParams = <T extends object>(params: T): Partial<T> => {
  const cleanedEntries = Object.entries(params).filter(([, value]) => {
    if (value === undefined || value === null || value === '') {
      return false;
    }

    return true;
  });

  return Object.fromEntries(cleanedEntries) as Partial<T>;
};
