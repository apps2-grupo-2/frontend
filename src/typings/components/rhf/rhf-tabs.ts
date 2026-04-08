import type { FieldValues, UseControllerProps } from 'react-hook-form';

import type { TabsProps } from '@/typings/components/ui/tabs';

export type RhfTabsProps<T extends FieldValues> = UseControllerProps<T> & TabsProps;
