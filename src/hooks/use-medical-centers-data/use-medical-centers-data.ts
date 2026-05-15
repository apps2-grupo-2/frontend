import { useQuery } from '@tanstack/react-query';

import { getMedicalCenters } from '@/services/medical-centers';

const staleTime = 5 * 60 * 1000; // Los datos expiran después de 5 minutos

export const useMedicalCenters = (priority: string) =>
  useQuery({
    queryKey: ['MedicalCenters', priority],
    queryFn: () => getMedicalCenters(priority),
    staleTime,
    enabled: priority !== '', // Ejecuta la consulta si se seleccionó una prioridad
  });