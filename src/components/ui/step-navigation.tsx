import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { StepNavigationProps } from '@/typings/components/ui/step-navigation';
import { Button } from './button';

export const StepNavigation = (props: StepNavigationProps) => {
  const { backBtn, nextBtn } = props;
  return (
    <div className="flex w-full max-w-[500px] justify-between">
      {!backBtn?.hidden && (
        <Button variant="outline" size="lg" disabled={backBtn?.disabled} onClick={backBtn?.onClick}>
          <ChevronLeft />
          Volver
        </Button>
      )}
      {!nextBtn?.hidden && (
        <Button type="submit" form="form" size="lg" disabled={nextBtn?.disabled}>
          Siguiente <ChevronRight />
        </Button>
      )}
    </div>
  );
};
