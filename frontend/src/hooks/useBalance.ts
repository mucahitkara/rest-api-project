'use client';

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { BalanceResponse } from '@/types';

export const useBalance = () => {
  return useQuery<BalanceResponse>({
    queryKey: ['balance'],
    queryFn: async () => {
      const response = await apiService.getBalance();
      return response.data;
    },
  });
};
