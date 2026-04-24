import api from './api';
import type {
  LoginRequest,
  RefreshTokenRequest,
  RegisterResponse,
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

  verifyEmail(code: string, verificationToken: string): Promise<TokenResponse> {
    return api
      .post<TokenResponse>(
        '/auth/verify-email',
        { code },
        { headers: { Authorization: `Bearer ${verificationToken}` } },
      )
      .then((r) => r.data);
  },

  resendVerification(verificationToken: string): Promise<{ message: string }> {
    return api
      .post<{
        message: string;
      }>('/auth/resend-verification', undefined, { headers: { Authorization: `Bearer ${verificationToken}` } })
      .then((r) => r.data);
  },

  requestVerification(email: string): Promise<RegisterResponse> {
    return api
      .post<RegisterResponse>('/auth/request-verification', { email })
      .then((r) => r.data);
  },
};
