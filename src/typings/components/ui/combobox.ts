import type { Combobox } from '@base-ui/react';

export type ComboboxProps = Combobox.Value.Props & CustomProps;

type CustomProps = {
  label?: string;
  loading?: boolean;
  options: Options[];
  placeholder: string;
  onValueChange?: (value: string) => void;
};

type Options = {
  value: string;
  label: string;
};
