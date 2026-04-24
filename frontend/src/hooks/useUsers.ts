'use client';

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { UserWithId } from '@/types';

export const useUsers = (filter: string) => {
  return useQuery<UserWithId[]>({
    queryKey: ['users', filter],
    queryFn: async () => {
      const response = await apiService.getOtherUsers(filter);
      return response.data.users || [];
    },
  });
};
