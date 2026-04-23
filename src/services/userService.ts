import api from './api';
import type { UserCreate, UserUpdate, UserResponse } from '@/types/users';

export const userService = {
  register(data: UserCreate): Promise<UserResponse> {
    return api.post<UserResponse>('/users/register', data).then((r) => r.data);
  },

  getAll(skip = 0, limit = 100): Promise<UserResponse[]> {
    return api
      .get<UserResponse[]>('/users/', { params: { skip, limit } })
      .then((r) => r.data);
  },

  getById(userId: string): Promise<UserResponse> {
    return api.get<UserResponse>(`/users/${userId}`).then((r) => r.data);
  },

  getByEmail(email: string): Promise<UserResponse> {
    return api
      .get<UserResponse>(`/users/email/${encodeURIComponent(email)}`)
      .then((r) => r.data);
  },

  update(userId: string, data: UserUpdate): Promise<UserResponse> {
    return api.put<UserResponse>(`/users/${userId}`, data).then((r) => r.data);
  },

  delete(userId: string): Promise<void> {
    return api.delete(`/users/${userId}`).then(() => undefined);
  },
};
