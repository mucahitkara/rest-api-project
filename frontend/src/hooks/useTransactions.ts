'use client';

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Transaction } from '@/types';

export const useTransactions = () => {
  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await apiService.getTransactionHistory();
      return response.data.transactions;
    },
  });
};
