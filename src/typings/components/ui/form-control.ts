import type { PropsWithChildren } from 'react';
import type { FieldError } from 'react-hook-form';

export type FormControlProps = PropsWithChildren & {
  disabled?: boolean;
  error?: FieldError | undefined;
  label?: string;
};
