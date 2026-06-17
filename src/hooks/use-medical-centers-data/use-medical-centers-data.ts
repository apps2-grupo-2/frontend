import { useQuery } from '@tanstack/react-query';

import type { MedicalCentersRequest } from '@/typings/services/medical-centers';
import { getMedicalCenterById, getMedicalCenters } from '@/services/medical-centers';

const staleTime = 5 * 60 * 1000; // Los datos expiran después de 5 minutos

export const useMedicalCenters = (data: MedicalCentersRequest, enabled: boolean) => {
  return useQuery({
    queryKey: ['MedicalCenters', data],
    queryFn: () => getMedicalCenters(data),
    staleTime,
    enabled,
  });
};

export const useMedicalCenterById = (id?: string) => {
  return useQuery({
    queryKey: ['MedicalCenters', id],
    queryFn: () => getMedicalCenterById(id!),
    staleTime,
    enabled: !!id,
  });
};