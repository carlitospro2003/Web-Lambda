export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api'
};

export const API_ENDPOINTS = {
  login: '/login',
  logout: '/logout',
  register: '/register',
  // Admin endpoints
  getAllUsers: (filter: string) => `/admin/getAllUsers/${filter}`
};