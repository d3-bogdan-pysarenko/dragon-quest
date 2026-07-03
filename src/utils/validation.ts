import { EMAIL_REGEX } from '../constants';

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};
