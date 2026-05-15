import { useQuery } from '@tanstack/react-query';

import { getModules } from '@/services/others';

const staleTime = 5 * 60 * 1000; // Los datos expiran después de 5 minutos

export const useGetModules = () =>
  useQuery({
    queryKey: ['useGetModules'],
    queryFn: getModules,
    staleTime,
  });