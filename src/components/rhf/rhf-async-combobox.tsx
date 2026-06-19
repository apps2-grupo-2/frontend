import type { FieldValues } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { useController } from 'react-hook-form';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

import type { CommandListContentProps, RhfAsyncComboboxProps } from '@/typings/components/rhf/rhf-async-combobox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl } from '@/components/ui/form-control';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export const RhfAsyncCombobox = <T extends FieldValues>(props: RhfAsyncComboboxProps<T>) => {
  const { name, rules, shouldUnregister, defaultValue, control, disabled, exact, onValueChange, ...rest } = props;
  const [open, setOpen] = useState(false);

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

  const setSearchValue = (value: string) => {
    onValueChange?.(value);
  };

  const valueChangeHandler = (val: string) => {
    const value = val === field.value ? '' : val;
    setOpen(false);
    field.onChange(value);
  };

  const value = useMemo(() => {
    return rest.options.find(a => a.value === field.value) || null;
  }, [field.value, rest.options]);

  return (
    <FormControl disabled={disabled} label={rest.label} error={error}>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button aria-expanded={open} className="w-full p-5 justify-between" role="combobox" variant="outline">
            {value ? value.label : rest.placeholder}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command shouldFilter={false}>
            <CommandInput onValueChange={setSearchValue} placeholder="Escribe aquí..." value={rest.search} />
            <CommandList>
              <CommandListContent {...rest} value={field.value} valueChangeHandler={valueChangeHandler} />
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormControl>
  );
};

const CommandListContent = (props: CommandListContentProps) => {
  const { isFetching, options, search, value, valueChangeHandler } = props;
  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="size-4 animate-spin" />
        <span className="ml-2 text-muted-foreground text-sm">Buscando...</span>
      </div>
    );
  }
  if (!search) {
    return <div className="p-4 text-center text-muted-foreground text-sm">Escribe para ver resultados aquí</div>;
  }
  if (search && !isFetching && options.length === 0) {
    return <CommandEmpty>No se encontraron resultados.</CommandEmpty>;
  }
  if (options.length > 0) {
    return (
      <CommandGroup>
        {options.map(option => (
          <CommandItem key={option.value} onSelect={valueChangeHandler} value={option.value} className="py-3">
            <Check className={cn('mr-2 size-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
            <div className="flex flex-col">
              <span className="text-md font-medium">{option.label}</span>
              <span className="text-sm text-muted-foreground">{option.subtitle}</span>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    );
  }
};