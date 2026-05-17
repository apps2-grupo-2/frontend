import type { FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { es } from 'react-day-picker/locale';

import type { RhfCalendarProps } from '@/typings/components/rhf/rhf-calendar';
import { FormControl } from '@/components/ui/form-control';
import { cn } from '@/lib/utils';
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

  const handleSelect = (date: Date | undefined) => {
    if (date) onChange(date);
  };

  const disabledMatcher = rest.enabledDates
    ? (date: Date) =>
        !rest.enabledDates!.some(
          d =>
            d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
        )
    : undefined;

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
          onSelect={handleSelect}
          disabled={disabledMatcher}
          startMonth={rest.startMonth}
          locale={es}
          className="bg-white p-0"
        />
      </div>
    </FormControl>
  );
};