import type { ChipProps } from '@/typings/components/ui/chip';
import { cn } from '@/lib/utils';

export const Chip = (props: ChipProps) => {
  const { disabled, label, selected, onClick } = props;
  return (
    <div
      className={cn(
        'cursor-pointer rounded-sm border px-3 py-2 shadow-sm transition-colors duration-200 ease-in-out select-none',
        selected ? 'bg-primary text-white' : 'bg-white text-black'
      )}
      onClick={() => !disabled && onClick?.()}
    >
      {label}
    </div>
  );
};
