import { api } from '../../../core/api';

export interface LoginPayload {
  username: string;
  password_text: string;
}

export const loginRequest = async (payload: LoginPayload) => {
  // Maps directly to apps/backend/src/modules/auth/auth.routes.ts
  const response = await api.post('/api/auth/login', {
    username: payload.username,
    password: payload.password_text, // Maps to backend expected key
  });
  return response.data;
};