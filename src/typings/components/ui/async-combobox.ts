import type { Combobox } from '@base-ui/react';

export type AsyncComboboxProps = Combobox.Value.Props & CustomProps;

type CustomProps = {
  label?: string;
  loading?: boolean;
  options: Options[];
  placeholder: string;
  onValueChange?: (value: string) => void;
  search: string;
  isFetching: boolean;
};

type Options = {
  value: string;
  label: string;
  subtitle: string;
};