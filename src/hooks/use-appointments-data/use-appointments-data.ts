import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import type {
  CheckInAppointmentResponse,
  CreateAppointmentRequest,
  GetAppointmentsRequest,
  RescheduleAppointmentRequest,
} from '@/typings/services';
import {
  cancelAppointment,
  checkInAppointment,
  confirmAppointment,
  createAppointment,
  finishAppointment,
  getAppointments,
  rescheduleAppointment,
  startAppointment,
} from '@/services/appointments';

const staleTime = 5 * 60 * 1000;

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

export const useStartAppointment = () =>
  useMutation({
    mutationFn: (id: number) => startAppointment(id),
  });

export const useFinishAppointment = () =>
  useMutation({
    mutationFn: (id: number) => finishAppointment(id),
  });

export const useRescheduleAppointment = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: number; body: RescheduleAppointmentRequest }) => rescheduleAppointment(id, body),
  });