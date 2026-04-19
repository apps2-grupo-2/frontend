export type GridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type GridProps = {
  container?: boolean;
  spacing?: number;
  columns?: number;
  size?: GridSize | Partial<Record<Breakpoint, GridSize>>;
  direction?: 'row' | 'column';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
  children?: React.ReactNode;
};
