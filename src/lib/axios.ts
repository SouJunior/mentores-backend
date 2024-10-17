import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://api.calendly.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export const axiosCallback = axios.create({
  baseURL: 'https://auth.calendly.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
