import type { Combobox } from '@base-ui/react';

export type ChipProps = Combobox.Value.Props & CustomProps;

type CustomProps = {
  label: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
};
