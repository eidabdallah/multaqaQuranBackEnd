import { customAlphabet } from 'nanoid';

export const generateRandomCode = () =>
  customAlphabet('123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)();
