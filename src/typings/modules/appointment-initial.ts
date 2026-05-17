import type { UseFormReturn } from 'react-hook-form';

import type { PRIORITY_TYPES } from '@/constants';
import type { UseAppointmentsData } from '@/typings/hooks/use-appointments';

export type StepProps = UseAppointmentsData;

export type AppointmentInitialFormProps = {
  professional_id: string;
  speciality_id: string;
  priority: (typeof PRIORITY_TYPES)[keyof typeof PRIORITY_TYPES] | '';
  medical_center_id: string;
  date: string | undefined;
  starts_at: string;
};

export type FormContentProps = {
  form: UseFormReturn<AppointmentInitialFormProps>;
};