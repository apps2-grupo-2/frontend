import type { FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import type { RhfSelectProps } from '@/typings/components/rhf/rhf-select';
import { FormControl } from '@/components/ui/form-control';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldSkeleton } from '../ui/field-skeleton';

export const RhfSelect = <T extends FieldValues>(props: RhfSelectProps<T>) => {
  const { name, rules, shouldUnregister, defaultValue, control, disabled, exact, onValueChange, ...rest } = props;
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    defaultValue,
    disabled,
    exact,
    name,
    rules,
    shouldUnregister,
  });

  const valueChangeHandler = (value: string) => {
    field.onChange(value);
    onValueChange?.(value);
  };

  if (rest.loading) {
    return <FieldSkeleton />;
  }

  return (
    <FormControl disabled={disabled} label={rest.label} error={error}>
      <Select value={field.value} onValueChange={valueChangeHandler} disabled={disabled}>
        <SelectTrigger aria-invalid={!!error} className="border-gray-400 bg-white px-3 py-5">
          <SelectValue placeholder={rest.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {rest.options.map(a => (
              <SelectItem key={a.value} value={a.value} className="px-3 py-2">
                {a.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormControl>
  );
};
