/** Minimal user info returned inside GroupResponse — only id and name. */
export interface GroupMemberResponse {
  id: string;
  name: string;
}

export interface GroupCreate {
  group_name: string;
}

export interface GroupUpdate {
  group_name?: string | null;
}

export interface GroupResponse {
  id: string;
  group_name: string;
  users: GroupMemberResponse[];
  created_at: string;
  updated_at: string;
}

export interface AddUserRequest {
  user_id: string;
}
