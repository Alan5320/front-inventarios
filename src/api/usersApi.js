import { apiRequest } from './http';

export const usersApi = {
  list: (token) => apiRequest('/users', { token }),
  getById: (id, token) => apiRequest(`/users/${id}`, { token }),
  create: (payload, token) =>
    apiRequest('/users', { method: 'POST', body: payload, token }),
  update: (id, payload, token) =>
    apiRequest(`/users/${id}`, { method: 'PUT', body: payload, token }),
  updatePassword: (id, newPassword, token) =>
    apiRequest(`/users/${id}/password`, {
      method: 'PATCH',
      body: { newPassword },
      token
    }),
  remove: (id, token) => apiRequest(`/users/${id}`, { method: 'DELETE', token }),
  me: (token) => apiRequest('/users/me', { token })
};
