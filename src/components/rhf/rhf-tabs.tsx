import type { FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { RhfTabsProps } from '@/typings/components/rhf/rhf-tabs';

export const RhfTabs = <T extends FieldValues>(props: RhfTabsProps<T>) => {
  const { name, rules, shouldUnregister, defaultValue, control, disabled, exact, options, onValueChange, ...rest } =
    props;
  const { field } = useController({
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

  return (
    <Tabs value={field.value} onValueChange={valueChangeHandler} {...rest}>
      <TabsList className="h-auto! w-full">
        {options.map(a => (
          <TabsTrigger
            key={a.value}
            value={a.value}
            className="flex-1 cursor-pointer px-10 py-3 whitespace-normal"
            style={{ height: '-webkit-fill-available' }}
          >
            {a.icon}
            {a.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
