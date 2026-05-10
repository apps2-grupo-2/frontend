import { useQuery } from '@tanstack/react-query';

import { getMedicalCenters, getProfessionals } from '@/services/appointments';
import { getSpecialities } from '@/services/specialties';

const staleTime = 5 * 60 * 1000; // Los datos expiran después de 5 minutos

export const useGetProfessionals = () =>
  useQuery({
    queryKey: ['useGetProfessionals'],
    queryFn: getProfessionals,
    staleTime,
  });

export const useGetSpecialties = () =>
  useQuery({
    queryKey: ['useGetSpecialties'],
    queryFn: getSpecialities,
    staleTime,
  });

export const useMedicalCenters = (priority: string) =>
  useQuery({
    queryKey: ['MedicalCenters', priority],
    queryFn: () => getMedicalCenters(priority),
    staleTime,
    enabled: priority !== '', // Ejecuta la consulta si se seleccionó una prioridad
  });