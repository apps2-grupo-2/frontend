import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { format } from 'date-fns';

import type { AppointmentInitialFormProps } from '@/typings/modules/appointment-initial';
import type { GetAppointmentsRequest } from '@/typings/services';
import { useGetAppointments } from '@/hooks/use-appointments-data';

export const useGetAppointmentsData = (form: UseFormReturn<AppointmentInitialFormProps>) => {
  const watchedFields = useWatch({ control: form.control });
  const since = watchedFields.date ? format(new Date(watchedFields.date), 'yyyy-MM-dd 09:00:00') : undefined;
  const until = since ? format(since, 'yyyy-MM-dd 18:00:00') : undefined;

  const appointmentsDefaultParams: GetAppointmentsRequest = {
    since: since || '',
    until: until || '',
    speciality_id: Number(watchedFields.speciality_id) || undefined,
    medical_center_id: Number(watchedFields.medical_center_id) || undefined,
    //light_response: 1,
  };

  const isUseGetAppointmentsEnabled =
    !!appointmentsDefaultParams.since &&
    !!appointmentsDefaultParams.until &&
    !!appointmentsDefaultParams.speciality_id &&
    !!appointmentsDefaultParams.medical_center_id;

  const getApppointments = useGetAppointments(appointmentsDefaultParams, isUseGetAppointmentsEnabled);

  return {
    ...getApppointments,
    data: {
      appointments: getApppointments.data?.appointments || [],
    },
  };
};