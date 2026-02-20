import { apiRequest } from './http';

export const authApi = {
  login: ({ email, password }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    })
};
