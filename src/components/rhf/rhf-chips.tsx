import type { FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import type { RhfChipProps } from '@/typings/components/rhf/rhf-chips';
import { cn } from '@/lib/utils';
import { FormControl } from '@/components/ui/form-control';
import { Chip } from '../ui/chip';

export const RhfChips = <T extends FieldValues>(props: RhfChipProps<T>) => {
  const { control, defaultValue, disabled, name, rules, shouldUnregister, ...rest } = props;

  const {
    field: { value, onChange },
  } = useController({
    control,
    defaultValue,
    disabled,
    name,
    rules,
    shouldUnregister,
  });

  return (
    <div className="w-full">
      <FormControl label={rest.label} disabled={disabled}>
        <div className={cn('flex flex-wrap gap-3', disabled && 'pointer-events-none opacity-50')}>
          {rest.options.map(a => (
            <Chip
              selected={value === a.value}
              disabled={disabled}
              label={a.label}
              key={a.value}
              onClick={() => {
                onChange(a.value);
              }}
            />
          ))}
        </div>
      </FormControl>
    </div>
  );
};
