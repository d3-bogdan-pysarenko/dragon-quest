import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const yourEnergyApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const buildParams = <T extends object>(params: T): Partial<T> => {
  const cleanedEntries = Object.entries(params).filter(([, value]) => {
    if (value === undefined || value === null || value === '') {
      return false;
    }

    return true;
  });

  return Object.fromEntries(cleanedEntries) as Partial<T>;
};
