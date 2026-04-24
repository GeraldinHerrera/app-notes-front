import axios from 'axios';
import { Platform } from 'react-native';

// const baseURL =
//   Platform.OS === 'android'
//     ? 'http://192.168.40.16:3000/api'
//     : 'http://localhost:3000/api';
const baseURL = 'https://app-notes-back-production.up.railway.app/api'
export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
