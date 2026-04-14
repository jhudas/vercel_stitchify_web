const BASE_URL = 'https://stitchify-backend.onrender.com/api';

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('stitchify-token');
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
};

export default BASE_URL;
