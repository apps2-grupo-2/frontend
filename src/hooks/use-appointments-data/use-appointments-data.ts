import { useQuery } from '@tanstack/react-query';

import { getMedicalCenters, getProfessionals, getSpecialties } from '@/services/appointments';

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
    queryFn: getSpecialties,
    staleTime,
  });

export const useMedicalCenters = (priority: string) =>
  useQuery({
    queryKey: ['MedicalCenters', priority],
    queryFn: () => getMedicalCenters(priority),
    staleTime,
    enabled: priority !== '', // Ejecuta la consulta si se seleccionó una prioridad
  });
