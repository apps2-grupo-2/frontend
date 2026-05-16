import type { FieldValues, UseControllerProps } from 'react-hook-form';

export type RhfCalendarProps<T extends FieldValues> = UseControllerProps<T> & {
  label: string;
  enabledDates?: Date[];
  startMonth?: Date;
  endMonth?: Date;
};