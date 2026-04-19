import type { Select } from 'radix-ui';

export type SelectProps = Select.SelectProps & CustomProps;

type CustomProps = {
  label?: string;
  loading?: boolean;
  options: Options[];
  placeholder: string;
};

type Options = {
  value: string;
  label: string;
};
