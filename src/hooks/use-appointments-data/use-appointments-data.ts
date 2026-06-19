import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import type { CheckInAppointmentResponse, CreateAppointmentRequest, GetAppointmentsRequest } from '@/typings/services';
import {
  cancelAppointment,
  checkInAppointment,
  confirmAppointment,
  createAppointment,
  getAppointments,
} from '@/services/appointments';

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

export const useCancelAppointment = () =>
  useMutation({
    mutationFn: (id: number) => cancelAppointment(id),
  });

export const useConfirmAppointment = () =>
  useMutation({
    mutationFn: (id: number) => confirmAppointment(id),
  });

export const useCheckInAppointment = () =>
  useMutation<CheckInAppointmentResponse, Error, number>({
    mutationFn: async (id: number) => {
      try {
        return await checkInAppointment(id);
      } catch (error) {
        if (axios.isAxiosError<{ message?: string }>(error)) {
          const message = error.response?.data?.message || 'Error desconocido';
          throw new Error(message);
        }
        throw error instanceof Error ? error : new Error('Error desconocido');
      }
    },
  });