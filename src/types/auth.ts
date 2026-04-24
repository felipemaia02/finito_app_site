// ============================================================
// Auth Types — based on OpenAPI schemas
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  email: string | null;
  expires_at: string | null;
}

export interface RegisterResponse {
  message: string;
  verification_token: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
}
