import api from './api';
import {
  AddUserRequest,
  GroupCreate,
  GroupResponse,
  GroupUpdate,
} from '@/types/groups';

export const groupService = {
  async create(data: GroupCreate): Promise<GroupResponse> {
    const res = await api.post<GroupResponse>('/groups', data);
    return res.data;
  },

  async listMine(): Promise<GroupResponse[]> {
    const res = await api.get<GroupResponse[]>('/groups/me');
    return res.data;
  },

  async update(id: string, data: GroupUpdate): Promise<GroupResponse> {
    const res = await api.patch<GroupResponse>(`/groups/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/groups/${id}`);
  },

  async addUser(groupId: string, data: AddUserRequest): Promise<GroupResponse> {
    const res = await api.post<GroupResponse>(`/groups/${groupId}/users`, data);
    return res.data;
  },

  async removeUser(groupId: string, userId: string): Promise<GroupResponse> {
    const res = await api.delete<GroupResponse>(
      `/groups/${groupId}/users/${userId}`,
    );
    return res.data;
  },
};
