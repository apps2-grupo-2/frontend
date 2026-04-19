import type { FieldValues } from 'react-hook-form';
import { useMemo } from 'react';
import { useController } from 'react-hook-form';

import type { RhfComboboxProps } from '@/typings/components/rhf/rhf-combobox';
import { FormControl } from '@/components/ui/form-control';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { FieldSkeleton } from '../ui/field-skeleton';

export const RhfCombobox = <T extends FieldValues>(props: RhfComboboxProps<T>) => {
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

  const valueChangeHandler = (value: unknown) => {
    const val = value as RhfComboboxProps<T>['options'][0];
    field.onChange(val.value);
    onValueChange?.(val.value);
  };

  const value = useMemo(() => {
    return rest.options.find(a => a.value === field.value) || null;
  }, [field.value, rest.options]);

  if (rest.loading) {
    return <FieldSkeleton />;
  }

  return (
    <FormControl disabled={disabled} label={rest.label} error={error}>
      <Combobox items={rest.options} value={value} onValueChange={valueChangeHandler}>
        <ComboboxInput
          placeholder={rest.placeholder}
          aria-invalid={!!error}
          className="border-gray-400 bg-white px-1 py-5"
          disabled={disabled}
        />
        <ComboboxContent>
          <ComboboxEmpty>Sin coincidencias</ComboboxEmpty>
          <ComboboxList>
            {item => (
              <ComboboxItem key={item.value} value={item} className="px-3 py-2">
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </FormControl>
  );
};
