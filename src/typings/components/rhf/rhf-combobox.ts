import type { FieldValues, UseControllerProps } from 'react-hook-form';

import type { ComboboxProps } from '@/typings/components/ui/combobox';

export type RhfComboboxProps<T extends FieldValues> = UseControllerProps<T> & ComboboxProps;
