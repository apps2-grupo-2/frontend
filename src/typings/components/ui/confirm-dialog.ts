import type { VariantProps } from 'class-variance-authority';

import type { buttonVariants } from '@/components/ui/button';

export interface ConfirmDialogProps {
  title: string;
  description: string;
  ctaTitle: string;
  ctaVariant?: VariantProps<typeof buttonVariants>['variant'];
  dismissTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}