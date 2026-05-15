import { useQuery } from '@tanstack/react-query';

import type { AppointmentsRequest } from '@/typings/services';
import { getAppointments } from '@/services/appointments';

const staleTime = 5 * 60 * 1000; // Los datos expiran después de 5 minutos

export const useGetAppointments = (req: AppointmentsRequest, enabled: boolean) =>
  useQuery({
    queryKey: ['useGetAppointments', req],
    queryFn: () => getAppointments(req),
    staleTime,
    enabled,
  });