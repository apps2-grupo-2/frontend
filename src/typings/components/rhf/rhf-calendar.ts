import type { FieldValues, UseControllerProps } from 'react-hook-form';

export type RhfCalendarProps<T extends FieldValues> = UseControllerProps<T> & {
  label: string;
  disabledDates?: (date: Date) => boolean;
  startMonth?: Date;
};
