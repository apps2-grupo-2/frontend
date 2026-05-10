import type { UseFormReturn } from 'react-hook-form';

import type { PRIORITY_TYPES } from '@/constants';
import type { UseAppointmentsData } from '@/typings/hooks/use-appointments';

export type StepProps = UseAppointmentsData;

export type AppointmentInitialFormProps = {
  professional: string;
  speciality: string;
  priority: (typeof PRIORITY_TYPES)[keyof typeof PRIORITY_TYPES] | '';
  medicalCenter: string;
  date: Date | undefined;
  rangeTime: string;
};

export type FormContentProps = {
  form: UseFormReturn<AppointmentInitialFormProps>;
};