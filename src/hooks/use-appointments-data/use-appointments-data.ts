import { useMutation, useQuery } from '@tanstack/react-query';

import type { CreateAppointmentRequest, GetAppointmentsRequest } from '@/typings/services';
import { createAppointment, getAppointments } from '@/services/appointments';

const staleTime = 5 * 60 * 1000; // Los datos expiran después de 5 minutos

export const useGetAppointments = (req: GetAppointmentsRequest, enabled: boolean = true) =>
  useQuery({
    queryKey: ['useGetAppointments', req],
    queryFn: () => getAppointments(req),
    staleTime,
    enabled,
  });

export const useCreateAppointment = () =>
  useMutation({
    mutationFn: (data: CreateAppointmentRequest) => createAppointment(data),
  });