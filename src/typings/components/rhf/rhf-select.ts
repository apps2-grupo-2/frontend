import type { FieldValues, UseControllerProps } from 'react-hook-form';

import type { SelectProps } from '@/typings/components/ui/select';

export type RhfSelectProps<T extends FieldValues> = UseControllerProps<T> & SelectProps;
