const BASE_URL = 'https://stitchify-backend.onrender.com/api';

const getToken = () => localStorage.getItem('stitchify-token');

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

export const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  return res;
};

export default BASE_URL;
