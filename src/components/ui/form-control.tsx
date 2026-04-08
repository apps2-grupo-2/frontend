import type { FormControlProps } from '@/typings/components/ui/form-control';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

export const FormControl = (props: FormControlProps) => {
  const { children, disabled, error, label } = props;
  return (
    <Field data-invalid={!!error} className="w-full">
      {label && <FieldLabel className={disabled ? 'opacity-50' : ''}>{label}</FieldLabel>}
      {children}
      {!!error?.message && <FieldError>{error.message}</FieldError>}
    </Field>
  );
};
