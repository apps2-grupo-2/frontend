import { cn } from '@/lib/utils';

export const Divider = (props: React.ComponentProps<'hr'>) => {
  const { className, ...rest } = props;

  return <hr className={cn('my-4 border-t border-border', className)} {...rest} />;
};
