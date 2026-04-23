import api from './api';
import type {
  UserCreate,
  UserUpdate,
  UserResponse,
  UserPublicInfo,
} from '@/types/users';

export const userService = {
  register(data: UserCreate): Promise<UserResponse> {
    return api.post<UserResponse>('/users/register', data).then((r) => r.data);
  },

  getById(userId: string): Promise<UserResponse> {
    return api.get<UserResponse>(`/users/${userId}`).then((r) => r.data);
  },

  /** Returns the authenticated user's full data. */
  getMe(): Promise<UserResponse> {
    return api.get<UserResponse>('/users/me').then((r) => r.data);
  },

  /** Returns only id + email — see UserPublicInfo. */
  getByEmail(email: string): Promise<UserPublicInfo> {
    return api
      .get<UserPublicInfo>(`/users/email/${encodeURIComponent(email)}`)
      .then((r) => r.data);
  },

  update(userId: string, data: UserUpdate): Promise<UserResponse> {
    return api.put<UserResponse>(`/users/${userId}`, data).then((r) => r.data);
  },

  delete(userId: string): Promise<void> {
    return api.delete(`/users/${userId}`).then(() => undefined);
  },
};
