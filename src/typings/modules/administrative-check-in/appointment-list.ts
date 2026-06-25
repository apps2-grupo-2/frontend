import type { UseQueryResult } from '@tanstack/react-query';

import type { GetAppointmentsResponse } from '@/typings/services';

export type AppointmentListProps = {
  appointments: UseQueryResult<GetAppointmentsResponse, Error>;
};

export type AppointmentCardProps = {
  appointment: GetAppointmentsResponse['appointments'][number];
  refreshAppointments: () => void;
};