import { useQuery } from '@tanstack/react-query';

import { getSpecialities } from '@/services/specialties';

const staleTime = 5 * 60 * 1000; // Los datos expiran después de 5 minutos

export const useGetSpecialties = () =>
  useQuery({
    queryKey: ['useGetSpecialties'],
    queryFn: getSpecialities,
    staleTime,
  });