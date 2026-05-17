import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav aria-label="pagination" data-slot="pagination" className={cn('mx-auto flex w-full', className)} {...props} />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot="pagination-content" className={cn('flex items-center gap-0.5', className)} {...props} />;
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>;

function PaginationLink({ className, disabled, isActive, size = 'icon', ...props }: PaginationLinkProps) {
  return (
    <Button asChild variant={isActive ? 'default' : 'ghost'} size={size} className={cn(className)} disabled={disabled}>
      <a
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(disabled && 'pointer-events-none opacity-50')}
        {...props}
      />
    </Button>
  );
}

function PaginationPrevious({
  className,
  text = 'Anterior',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string; disabled?: boolean }) {
  return (
    <PaginationLink aria-label="Go to previous page" size="default" className={cn('pl-1.5!', className)} {...props}>
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = 'Siguiente',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string; disabled?: boolean }) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" className={cn('pr-1.5!', className)} {...props}>
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};