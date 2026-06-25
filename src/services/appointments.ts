import axios from 'axios';

import type {
  CancelAppointmentResponse,
  CheckInAppointmentResponse,
  ConfirmAppointmentResponse,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
  GetAppointmentsRequest,
  GetAppointmentsResponse,
} from '@/typings/services';
import { ENV } from '@/constants';
// import {
//   mockCancelAppointment,
//   mockCheckInAppointment,
//   mockConfirmAppointment,
//   mockCreateAppointment,
//   mockGetAppointments,
// } from '@/mocks/appointments.mock';
//import { isMockEnabled } from '@/stores/mock.store';

export const getAppointments = async (req: GetAppointmentsRequest): Promise<GetAppointmentsResponse> => {
  //if (isMockEnabled()) return mockGetAppointments(req);
  await new Promise(a => setTimeout(a, 50));
  try {
    const url = `${ENV.BASE_URL}/appointments`;
    const response = await axios.get<GetAppointmentsResponse>(url, { params: req });
    return response.data;
  } catch (err) {
    // 404 = no appointments found for the given criteria → return empty list
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return {
        appointments: [],
        pagination: {
          appointments_per_page: 0,
          total_appointments: 0,
          total_pages: 0,
        },
      };
    }
    // Any other error (network, 5xx, etc.) → rethrow so useQuery sets isError = true
    throw err;
  }
};

export const createAppointment = async (data: CreateAppointmentRequest): Promise<CreateAppointmentResponse> => {
  //if (isMockEnabled()) return mockCreateAppointment(data);
  const response = await axios.post<CreateAppointmentResponse>(`${ENV.BASE_URL}/appointments`, data);
  return response.data;
};

export const cancelAppointment = async (id: number): Promise<CancelAppointmentResponse> => {
  //if (isMockEnabled()) return mockCancelAppointment(id);
  const response = await axios.delete<CancelAppointmentResponse>(`${ENV.BASE_URL}/appointments/${id}`);
  return response.data;
};

export const confirmAppointment = async (id: number): Promise<ConfirmAppointmentResponse> => {
  //if (isMockEnabled()) return mockConfirmAppointment(id);
  const response = await axios.patch<ConfirmAppointmentResponse>(`${ENV.BASE_URL}/appointments/${id}/confirm`);
  return response.data;
};

export const checkInAppointment = async (id: number): Promise<CheckInAppointmentResponse> => {
  //if (isMockEnabled()) return mockCheckInAppointment(id);
  const response = await axios.patch<CheckInAppointmentResponse>(`${ENV.BASE_URL}/appointments/${id}/check-in`);
  return response.data;
};