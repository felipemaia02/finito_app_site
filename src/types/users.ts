// ============================================================
// User Types — based on OpenAPI schemas
// ============================================================

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  date_birth: string; // YYYY-MM-DD
}

export interface UserUpdate {
  name?: string | null;
  email?: string | null;
  date_birth?: string | null;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  date_birth: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
