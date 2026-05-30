import { useQuery } from '@tanstack/react-query';

import type { MedicalCentersRequest } from '@/typings/services/medical-centers';
import { getMedicalCenters } from '@/services/medical-centers';

const staleTime = 5 * 60 * 1000; // Los datos expiran después de 5 minutos

export const useMedicalCenters = (data: MedicalCentersRequest, enabled: boolean) => {
  return useQuery({
    queryKey: ['MedicalCenters', data],
    // TODO: Pasar data cuando soporte los parametros
    queryFn: () => getMedicalCenters({}),
    staleTime,
    enabled,
  });
};