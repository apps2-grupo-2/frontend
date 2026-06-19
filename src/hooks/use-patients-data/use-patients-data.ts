import { useQuery } from '@tanstack/react-query';

import { getPatientsSearch } from '@/services/patients';

const staleTime = 5 * 60 * 1000;

export const useGetPatientsSearch = (search: string) =>
  useQuery({
    queryKey: ['useGetPatientsSearch', search],
    queryFn: () => getPatientsSearch(search),
    staleTime,
    enabled: !!search,
  });