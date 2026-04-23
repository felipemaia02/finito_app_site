import { UserResponse } from './users';

export interface GroupCreate {
  group_name: string;
}

export interface GroupUpdate {
  group_name?: string | null;
}

export interface GroupResponse {
  id: string;
  group_name: string;
  users: UserResponse[];
  created_at: string;
  updated_at: string;
}

export interface AddUserRequest {
  user_id: string;
}
