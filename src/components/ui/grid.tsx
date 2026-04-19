import type { GridProps, GridSize } from '@/typings/components/ui/grid';
import { cn } from '@/lib/utils';

const GRID_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
};

// MUI spacing unit = 8px → Tailwind gap (gap-2 = 8px)
const GAP: Record<number, string> = {
  0: 'gap-0',
  1: 'gap-2',
  2: 'gap-4',
  3: 'gap-6',
  4: 'gap-8',
  5: 'gap-10',
  6: 'gap-12',
};

const DIRECTION: Record<string, string> = {
  row: '',
  column: 'grid-flow-col',
};

const ALIGN_ITEMS: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const JUSTIFY_CONTENT: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const COL_SPAN: Record<string, Record<string | number, string>> = {
  xs: {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
    auto: 'col-auto',
  },
  sm: {
    1: 'sm:col-span-1',
    2: 'sm:col-span-2',
    3: 'sm:col-span-3',
    4: 'sm:col-span-4',
    5: 'sm:col-span-5',
    6: 'sm:col-span-6',
    7: 'sm:col-span-7',
    8: 'sm:col-span-8',
    9: 'sm:col-span-9',
    10: 'sm:col-span-10',
    11: 'sm:col-span-11',
    12: 'sm:col-span-12',
    auto: 'sm:col-auto',
  },
  md: {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
    5: 'md:col-span-5',
    6: 'md:col-span-6',
    7: 'md:col-span-7',
    8: 'md:col-span-8',
    9: 'md:col-span-9',
    10: 'md:col-span-10',
    11: 'md:col-span-11',
    12: 'md:col-span-12',
    auto: 'md:col-auto',
  },
  lg: {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
    5: 'lg:col-span-5',
    6: 'lg:col-span-6',
    7: 'lg:col-span-7',
    8: 'lg:col-span-8',
    9: 'lg:col-span-9',
    10: 'lg:col-span-10',
    11: 'lg:col-span-11',
    12: 'lg:col-span-12',
    auto: 'lg:col-auto',
  },
  xl: {
    1: 'xl:col-span-1',
    2: 'xl:col-span-2',
    3: 'xl:col-span-3',
    4: 'xl:col-span-4',
    5: 'xl:col-span-5',
    6: 'xl:col-span-6',
    7: 'xl:col-span-7',
    8: 'xl:col-span-8',
    9: 'xl:col-span-9',
    10: 'xl:col-span-10',
    11: 'xl:col-span-11',
    12: 'xl:col-span-12',
    auto: 'xl:col-auto',
  },
};

const getSizeClasses = (size: GridProps['size']): string[] => {
  if (size === undefined) return [];

  if (typeof size === 'number' || size === 'auto') {
    return [COL_SPAN.xs[size] ?? ''];
  }

  return Object.entries(size)
    .map(([bp, s]) => COL_SPAN[bp]?.[s as GridSize] ?? '')
    .filter(Boolean);
};

/**
 * Grid component basado en la API de MUI Grid v2, implementado con TailwindCSS.
 * @see https://mui.com/material-ui/react-grid/
 */
export const Grid = (props: GridProps) => {
  const {
    container,
    spacing = 0,
    columns = 12,
    size,
    direction,
    alignItems,
    justifyContent,
    className,
    children,
  } = props;

  const containerClasses = container
    ? [
        'grid',
        GRID_COLS[columns] ?? '',
        GAP[spacing] ?? '',
        direction ? (DIRECTION[direction] ?? '') : '',
        alignItems ? (ALIGN_ITEMS[alignItems] ?? '') : '',
        justifyContent ? (JUSTIFY_CONTENT[justifyContent] ?? '') : '',
      ]
    : [];

  const sizeClasses = getSizeClasses(size);

  return <div className={cn(...containerClasses, ...sizeClasses, className)}>{children}</div>;
};
