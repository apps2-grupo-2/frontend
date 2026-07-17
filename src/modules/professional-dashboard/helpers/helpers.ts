import { addWeeks, eachDayOfInterval, endOfWeek, format, getWeek, isWeekend, startOfWeek } from 'date-fns';

import type { GetDayAppointmentsResponse } from '@/typings/modules/professional-dashboard';
import type { Appointment } from '@/typings/services';

export const getWeekNumber = () => {
  return getWeek(new Date(), { weekStartsOn: 1 });
};

export const getFormattedDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getDate()} ${d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}`;
};

export const getWeekdaysByOffset = (weekOffset: number) => {
  const base = addWeeks(new Date(), weekOffset);
  const start = startOfWeek(base);
  const end = endOfWeek(base);
  return eachDayOfInterval({ start, end }).filter(day => !isWeekend(day));
};

export const getDayAppointments = (appointments: Appointment[] = [], date: Date): GetDayAppointmentsResponse[] => {
  const slots: GetDayAppointmentsResponse[] = [];
  const startHour = 9;
  const endHour = 18;
  let id = 0;

  for (let hour = startHour; hour < endHour; hour++) {
    for (const minutes of [0, 30]) {
      const slotDate = new Date(date);
      slotDate.setHours(hour, minutes, 0, 0);
      const slotDateTime = format(slotDate, 'yyyy-MM-dd HH:mm:ss');

      const appointment = appointments.find(a => a.starts_at === slotDateTime);

      if (appointment) {
        slots.push({
          id: id++,
          appointmentId: appointment.id,
          starts_at: slotDateTime,
          status: appointment.status,
          patient: {
            id: appointment.patient.id,
            fullname: appointment.patient.fullname,
            dni: '',
          },
        });
      } else {
        slots.push({
          id: id++,
          appointmentId: null,
          starts_at: slotDateTime,
          status: 'available',
          patient: { id: 0, fullname: '', dni: '' },
        });
      }
    }
  }

  return slots;
};