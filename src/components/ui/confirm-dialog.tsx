import type { ConfirmDialogProps } from '@/typings/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { title, description, ctaTitle, ctaVariant = 'default', dismissTitle, open, onOpenChange, onConfirm } = props;

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {dismissTitle || 'Volver'}
          </Button>
          <Button onClick={handleConfirm} variant={ctaVariant}>
            {ctaTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};