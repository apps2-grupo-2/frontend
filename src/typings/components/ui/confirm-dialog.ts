export interface ConfirmDialogProps {
  title: string;
  description: string;
  ctaTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}