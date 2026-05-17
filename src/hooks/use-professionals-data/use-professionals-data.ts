import { useQuery } from '@tanstack/react-query';

import { getProfessionals } from '@/services/professionals';

const staleTime = 5 * 60 * 1000;

export const useGetProfessionals = (specialtyId: string) =>
  useQuery({
    queryKey: ['useGetProfessionals', specialtyId],
    queryFn: () => getProfessionals(specialtyId),
    staleTime,
    enabled: !!specialtyId,
  });