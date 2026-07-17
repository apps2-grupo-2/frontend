import { addDays, addMinutes, format, isWeekend } from 'date-fns';

import type { Appointment, OptionsResponse } from '@/typings/services';
import { parseApiDate } from '@/helpers/dates';

export const getCalendarDays = (): Date[] => {
  // Incluye HOY (i desde 0) para permitir sacar turno el mismo día. Los horarios
  // ya pasados de hoy se descartan en getRangeTimeAvailability.
  return Array.from({ length: 31 }, (_, i) => addDays(new Date(), i)).filter(date => !isWeekend(date));
};

export const getRangeTimeAvailability = (appointments: Appointment[], date: string): OptionsResponse => {
  const dateOnly = date.slice(0, 10);
  const appointmentsFiltered = appointments.filter(a => a.starts_at.startsWith(dateOnly));
  const occupiedSlots = appointmentsFiltered.map(a => a.starts_at);
  const now = new Date();

  const startHour = 9;
  const endHour = 18;
  const intervalMinutes = 30;
  const totalSlots = ((endHour - startHour) * 60) / intervalMinutes;

  return Array.from({ length: totalSlots }, (_, i) => {
    const day = parseApiDate(date);
    const base = new Date(day.getFullYear(), day.getMonth(), day.getDate(), startHour, 0);
    const slotStart = addMinutes(base, i * intervalMinutes);
    const slotEnd = addMinutes(slotStart, intervalMinutes);
    const label = `${format(slotStart, 'HH:mm')} - ${format(slotEnd, 'HH:mm')}`;
    const value = format(slotStart, 'yyyy-MM-dd HH:mm:ss');
    return { label, value, slotStart };
  })
    .filter(a => a.slotStart > now && !occupiedSlots.includes(a.value))
    .map(({ label, value }) => ({ label, value }));
};