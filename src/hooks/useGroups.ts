import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupService } from '@/services/groupService';
import { GroupCreate, GroupUpdate, AddUserRequest } from '@/types/groups';
import { useAuth } from '@/hooks/useAuth';

export const GROUP_KEYS = {
  all: ['groups'] as const,
  detail: (id: string) => ['groups', id] as const,
};

export function useGroups() {
  return useQuery({
    queryKey: GROUP_KEYS.all,
    queryFn: () => groupService.listAll(),
  });
}

/** Retorna apenas os grupos dos quais o usuário autenticado é membro. */
export function useMyGroups() {
  const { user } = useAuth();
  const query = useGroups();
  return {
    ...query,
    data: (query.data ?? []).filter((g) =>
      g.users.some((u) => u.id === user?.id),
    ),
  };
}

export function useGroupDetail(id: string | null) {
  return useQuery({
    queryKey: GROUP_KEYS.detail(id ?? ''),
    queryFn: () => groupService.getById(id!),
    enabled: !!id,
  });
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
