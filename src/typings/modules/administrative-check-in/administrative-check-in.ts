import type { UseFormReturn } from 'react-hook-form';

export type AdministrativeCheckInFormProps = {
  patientId: string;
};

export type SearchBarProps = {
  form: UseFormReturn<AdministrativeCheckInFormProps>;
};