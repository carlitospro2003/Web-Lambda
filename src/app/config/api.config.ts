import { environment } from '../../environments/environment';

export const API_ENDPOINTS = {
  login: `${environment.apiUrl}/login`,
  logout: `${environment.apiUrl}/logout`,
  register: `${environment.apiUrl}/register`,
  
  // Admin endpoints
  getAllUsers: (filter: string) => `${environment.apiUrl}/admin/getAllUsers/${filter}`,
  createUser: `${environment.apiUrl}/admin/createUser`,
  updateUser: (userId: number) => `${environment.apiUrl}/admin/updateUser/${userId}`,
  deleteUser: (userId: number) => `${environment.apiUrl}/admin/deleteUser/${userId}`
};