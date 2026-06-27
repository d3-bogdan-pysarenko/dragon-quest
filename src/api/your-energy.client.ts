import axios from 'axios';

export const yourEnergyApi = axios.create({
  baseURL: 'https://your-energy.b.goit.study/api',
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
