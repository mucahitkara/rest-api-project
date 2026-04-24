'use client';

import { useQuery } from '@tanstack/react-query';
import { nbpService } from '@/lib/nbp';
import { ExchangeRate } from '@/types';

export const useNbpRates = () => {
  return useQuery<ExchangeRate[]>({
    queryKey: ['nbpRates'],
    queryFn: () => nbpService.getAllCurrentRates(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
};
