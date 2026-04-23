import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { useAuthContext } from '@/context/AuthContext';
import type { UserUpdate } from '@/types/users';

export function useUpdateUser() {
  const qc = useQueryClient();
  const { updateUser } = useAuthContext();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserUpdate }) =>
      userService.update(userId, data),
    onSuccess: (updated) => {
      updateUser(updated);
      void qc.invalidateQueries({ queryKey: ['user', updated.id] });
    },
  });
}

export function useDeleteUser() {
  const { logout } = useAuthContext();
  return useMutation({
    mutationFn: (userId: string) => userService.delete(userId),
    onSuccess: () => logout(),
  });
}
