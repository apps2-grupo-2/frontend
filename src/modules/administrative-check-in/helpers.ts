import { format } from 'date-fns';

import type { Appointment } from '@/typings/services';
import { APPOINTMENT_STATUSES } from '@/constants';

export const statusConfig: Record<
  (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES],
  { label: string; className: string }
> = {
  [APPOINTMENT_STATUSES.PENDING_CONFIRMATION]: { label: 'Pendiente', className: 'bg-amber-500/10 text-amber-700' },
  [APPOINTMENT_STATUSES.CONFIRMED]: { label: 'Confirmado', className: 'bg-blue-500/10 text-blue-700' },
  [APPOINTMENT_STATUSES.CHECKED_IN]: { label: 'Llegó', className: 'bg-primary/10 text-primary' },
  [APPOINTMENT_STATUSES.IN_PROGRESS]: { label: 'En curso', className: 'bg-green-500/10 text-green-700' },
  [APPOINTMENT_STATUSES.COMPLETED]: { label: 'Finalizado', className: 'bg-muted text-muted-foreground' },
  [APPOINTMENT_STATUSES.CANCELLED]: { label: 'Cancelado', className: 'bg-destructive/10 text-destructive' },
  [APPOINTMENT_STATUSES.ABSENT]: { label: 'Ausente', className: 'bg-muted text-muted-foreground' },
  [APPOINTMENT_STATUSES.EXPIRED]: { label: 'Expirado', className: 'bg-muted text-muted-foreground' },
};

export const getTodayRange = () => {
  const date = format(new Date(), 'yyyy-MM-dd');
  return { since: `${date} 00:00:00`, until: `${date} 23:59:59` };
};

export const extractTime = (dateTimeStr: string) => dateTimeStr.split(' ')[1]?.slice(0, 5) ?? '';

export const canCheckIn = (status: Appointment['status']) =>
  status === APPOINTMENT_STATUSES.PENDING_CONFIRMATION || status === APPOINTMENT_STATUSES.CONFIRMED;

// Ordena los turnos dejando los "Finalizados" (COMPLETED) al final del listado.
export const sortByCompletedLast = (appointments: Appointment[]) =>
  [...appointments].sort((a, b) => {
    const aCompleted = a.status === APPOINTMENT_STATUSES.COMPLETED ? 1 : 0;
    const bCompleted = b.status === APPOINTMENT_STATUSES.COMPLETED ? 1 : 0;
    return aCompleted - bCompleted;
  });

export const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return `${format(date, 'dd/MM/yyyy')} a las ${format(date, 'HH:mm')}`;
};