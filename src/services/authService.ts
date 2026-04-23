import api from './api';
import type {
  LoginRequest,
  RefreshTokenRequest,
  TokenResponse,
  TokenValidationResponse,
} from '@/types/auth';

export const authService = {
  login(data: LoginRequest): Promise<TokenResponse> {
    return api.post<TokenResponse>('/auth/login', data).then((r) => r.data);
  },

  refresh(data: RefreshTokenRequest): Promise<TokenResponse> {
    return api.post<TokenResponse>('/auth/refresh', data).then((r) => r.data);
  },

  validate(): Promise<TokenValidationResponse> {
    return api
      .post<TokenValidationResponse>('/auth/validate')
      .then((r) => r.data);
  },
};
