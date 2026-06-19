import type { FieldValues, UseControllerProps } from 'react-hook-form';

import type { AsyncComboboxProps } from '@/typings/components/ui/async-combobox';

export type RhfAsyncComboboxProps<T extends FieldValues> = UseControllerProps<T> & AsyncComboboxProps;

export type CommandListContentProps = AsyncComboboxProps & {
  valueChangeHandler: (value: string) => void;
  value: string;
};