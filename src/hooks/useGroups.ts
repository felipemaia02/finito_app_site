import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupService } from '@/services/groupService';
import { GroupCreate, GroupUpdate, AddUserRequest } from '@/types/groups';

export const GROUP_KEYS = {
  all: ['groups'] as const,
  detail: (id: string) => ['groups', id] as const,
};

/** Retorna apenas os grupos do usuário autenticado (via /groups/me). */
export function useMyGroups() {
  return useQuery({
    queryKey: GROUP_KEYS.all,
    queryFn: () => groupService.listMine(),
  });
}

/** Busca um grupo pelo ID a partir do cache de useMyGroups — sem request extra. */
export function useGroupFromCache(id: string | null) {
  const { data: groups = [], isLoading, error } = useMyGroups();
  const group = id ? (groups.find((g) => g.id === id) ?? null) : null;
  return { data: group, isLoading, error };
}

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GroupCreate) => groupService.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: GROUP_KEYS.all });
    },
  });
}

export function useUpdateGroup(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GroupUpdate) => groupService.update(groupId, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: GROUP_KEYS.all });
      void qc.invalidateQueries({ queryKey: GROUP_KEYS.detail(groupId) });
    },
  });
}

export function useDeleteGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => groupService.delete(groupId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: GROUP_KEYS.all });
    },
  });
}

export function useAddUserToGroup(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddUserRequest) => groupService.addUser(groupId, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: GROUP_KEYS.detail(groupId) });
      void qc.invalidateQueries({ queryKey: GROUP_KEYS.all });
    },
  });
}

export function useRemoveUserFromGroup(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => groupService.removeUser(groupId, userId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: GROUP_KEYS.detail(groupId) });
      void qc.invalidateQueries({ queryKey: GROUP_KEYS.all });
    },
  });
}
