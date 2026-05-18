import { useState } from 'react';
import { isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { WeekdaySelectorProps } from '@/typings/modules/professional-dashboard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getFormattedDate, getWeekdaysByOffset, getWeekNumber } from '../helpers/helpers';

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];

export const WeekdaySelector = (props: WeekdaySelectorProps) => {
  const { selectedDay, onSelectDay } = props;
  const [weekNumber, setWeekNumber] = useState(0);

  const days = getWeekdaysByOffset(weekNumber);

  return (
    <>
      {/* Navegación de semana */}
      <div className="flex items-center justify-between">
        <span className="mt-1 text-sm text-muted-foreground">
          {getFormattedDate(selectedDay)} - (Semana {getWeekNumber() + weekNumber})
        </span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled={weekNumber === 0} onClick={() => setWeekNumber(a => a - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={weekNumber === 3} onClick={() => setWeekNumber(a => a + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs de días */}
      <div className="flex gap-1 rounded-lg border border-border bg-white p-1">
        {days.map((day, index) => {
          return (
            <button
              key={`day-${index}`}
              onClick={() => onSelectDay(day)}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-2 text-xs transition-all duration-150 active:scale-[0.95]',
                isSameDay(selectedDay, day)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm'
              )}
            >
              <span className="font-medium select-none">{DAY_LABELS[index]}</span>
              <span
                className={cn('text-xs select-none', isSameDay(selectedDay, day) ? 'text-primary-foreground/80' : '')}
              >
                {day.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};