import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { format } from 'date-fns';

import type { AppointmentInitialFormProps } from '@/typings/modules/appointment-initial';
import type { GetAppointmentsRequest } from '@/typings/services';
import { parseApiDate } from '@/helpers/dates';
import { useGetAppointments } from '@/hooks/use-appointments-data';

export const useGetAppointmentsData = (form: UseFormReturn<AppointmentInitialFormProps>) => {
  const watchedFields = useWatch({ control: form.control });
  const baseDate = watchedFields.date ? parseApiDate(watchedFields.date) : undefined;
  const since = baseDate ? format(baseDate, 'yyyy-MM-dd 00:00:00') : undefined;
  const until = baseDate ? format(baseDate, 'yyyy-MM-dd 23:59:59') : undefined;

  const appointmentsDefaultParams: GetAppointmentsRequest = {
    since: since || '',
    until: until || '',
    speciality_id: Number(watchedFields.speciality_id) || undefined,
    medical_center_id: Number(watchedFields.medical_center_id) || undefined,
    medic_id: Number(watchedFields.professional_id) || undefined,
    light_response: 1,
  };

  const isUseGetAppointmentsEnabled =
    !!appointmentsDefaultParams.since &&
    !!appointmentsDefaultParams.until &&
    !!appointmentsDefaultParams.speciality_id &&
    !!appointmentsDefaultParams.medical_center_id &&
    !!appointmentsDefaultParams.medic_id;

  const getApppointments = useGetAppointments(appointmentsDefaultParams, isUseGetAppointmentsEnabled);

  return {
    ...getApppointments,
    data: {
      appointments: getApppointments.data?.appointments || [],
    },
  };
};