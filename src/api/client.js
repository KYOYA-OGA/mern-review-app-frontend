import axios from 'axios';

const URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api'
    : 'https://kyoyadev.tech/api';
const client = axios.create({
  baseURL: URL,
});

export default client;
