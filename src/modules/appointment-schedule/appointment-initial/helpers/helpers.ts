import { addDays, addMinutes, format } from 'date-fns';

import type { OptionsResponse } from '@/typings/services';

export const getCalendarDays = (): Date[] => {
  return Array.from({ length: 31 }, (_, i) => addDays(new Date(), i));
};

export const getRangeTimeAvailability = (date: Date, occupiedSlots: string[] = []): OptionsResponse => {
  const startHour = 9;
  const endHour = 18;
  const intervalMinutes = 30;
  const totalSlots = ((endHour - startHour) * 60) / intervalMinutes;

  return Array.from({ length: totalSlots }, (_, i) => {
    const base = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, 0);
    const slotStart = addMinutes(base, i * intervalMinutes);
    const slotEnd = addMinutes(slotStart, intervalMinutes);
    const label = `${format(slotStart, 'HH:mm')} - ${format(slotEnd, 'HH:mm')}`;
    const value = format(slotStart, 'yyyy-MM-dd HH:mm:ss');
    return { label, value };
  }).filter(slot => !occupiedSlots.includes(slot.value));
};