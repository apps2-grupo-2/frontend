import { useQuery } from '@tanstack/react-query';

import type { PRIORITY_TYPES } from '@/constants';
import { getMedicalCenters } from '@/services/medical-centers';

const staleTime = 5 * 60 * 1000; // Los datos expiran después de 5 minutos

export const useMedicalCenters = (priority: (typeof PRIORITY_TYPES)[keyof typeof PRIORITY_TYPES] | '') =>
  useQuery({
    queryKey: ['MedicalCenters', priority],
    queryFn: () => getMedicalCenters(priority),
    staleTime,
    enabled: priority !== '',
  });