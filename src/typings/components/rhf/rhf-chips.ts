import type { FieldValues, UseControllerProps } from 'react-hook-form';

export type RhfChipProps<T extends FieldValues> = UseControllerProps<T> & {
  options: Options[];
  label: string;
};

type Options = {
  value: string;
  label: string;
};
