import type { FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import type { RhfCalendarProps } from '@/typings/components/rhf/rhf-calendar';
import { cn } from '@/lib/utils';
import { FormControl } from '@/components/ui/form-control';
import { Calendar } from '../ui/calendar';

export const RhfCalendar = <T extends FieldValues>(props: RhfCalendarProps<T>) => {
  const { control, defaultValue, disabled, name, rules, shouldUnregister, ...rest } = props;

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    control,
    defaultValue,
    disabled,
    name,
    rules,
    shouldUnregister,
  });

  return (
    <FormControl label={rest.label} disabled={disabled} error={error}>
      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-lg border bg-white p-2 shadow-sm',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={rest.disabledDates}
          startMonth={rest.startMonth}
          className="bg-white p-0"
        />
      </div>
    </FormControl>
  );
};
