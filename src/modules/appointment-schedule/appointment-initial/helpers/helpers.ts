import { addDays, addMinutes, format, isWeekend } from 'date-fns';

import type { Appointment, OptionsResponse } from '@/typings/services';

export const getCalendarDays = (): Date[] => {
  return Array.from({ length: 31 }, (_, i) => addDays(new Date(), i + 1)).filter(date => !isWeekend(date));
};

export const getRangeTimeAvailability = (
  appointments: Appointment[],
  date: string,
  medic_id: string
): OptionsResponse => {
  const dateOnly = date.slice(0, 10);
  const appointmentsFiltered = appointments.filter(
    a => a.starts_at.startsWith(dateOnly) && a.medic.id === Number(medic_id)
  );
  const occupiedSlots = appointmentsFiltered.map(a => a.starts_at);

  const startHour = 9;
  const endHour = 18;
  const intervalMinutes = 30;
  const totalSlots = ((endHour - startHour) * 60) / intervalMinutes;

  return Array.from({ length: totalSlots }, (_, i) => {
    const day = new Date(date);
    const base = new Date(day.getFullYear(), day.getMonth(), day.getDate(), startHour, 0);
    const slotStart = addMinutes(base, i * intervalMinutes);
    const slotEnd = addMinutes(slotStart, intervalMinutes);
    const label = `${format(slotStart, 'HH:mm')} - ${format(slotEnd, 'HH:mm')}`;
    const value = format(slotStart, 'yyyy-MM-dd HH:mm:ss');
    return { label, value };
  }).filter(a => !occupiedSlots.includes(a.value));
};