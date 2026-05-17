import type { GetAppointmentsRequest, Pagination } from '@/typings/services';

export type AppointmentsPaginationProps = {
  pagination?: Pagination;
  appointmentsParams: GetAppointmentsRequest;
  setAppointmentsParams: (params: GetAppointmentsRequest) => void;
};