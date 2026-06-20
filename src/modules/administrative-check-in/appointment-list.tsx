import { CheckCircle2, Clock, Loader2, MapPin, Search, User } from 'lucide-react';

import type {
  AppointmentCardProps,
  AppointmentListProps,
} from '@/typings/modules/administrative-check-in/appointment-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { APPOINTMENT_STATUSES } from '@/constants';
import { useCheckInAppointment } from '@/hooks/use-appointments-data';
import { cn } from '@/lib/utils';
import {
  canCheckIn,
  formatDateTime,
  sortByCompletedLast,
  statusConfig,
} from '@/modules/administrative-check-in/helpers';

export const AppointmentList = (props: AppointmentListProps) => {
  const { appointments } = props;

  if (appointments.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Cargando turnos del día...</p>
      </div>
    );
  }

  if (!appointments.data?.appointments.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
        <Search className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="mt-1 text-xs text-muted-foreground">No se encontraron turnos programados para el día de hoy.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sortByCompletedLast(appointments.data.appointments).map(a => (
        <AppointmentCard key={a.id} appointment={a} />
      ))}
    </div>
  );
};

const AppointmentCard = (props: AppointmentCardProps) => {
  const { appointment } = props;
  const checkInAppointment = useCheckInAppointment();
  return (
    <Card
      style={{ animationDelay: `40ms` }}
      className={cn(
        'animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 border-border shadow-none transition-all',
        appointment.status === APPOINTMENT_STATUSES.COMPLETED && 'opacity-50',
        appointment.status === APPOINTMENT_STATUSES.CHECKED_IN && 'border-primary/30'
      )}
    >
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                {appointment.patient.fullname
                  .split(' ')
                  .slice(0, 2)
                  .map(n => n[0])
                  .join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{appointment.patient.fullname}</p>
                <p className="text-xs text-muted-foreground">{appointment.patient.email}</p>
              </div>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                statusConfig[appointment.status].className
              )}
            >
              {statusConfig[appointment.status].label}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 pl-12">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {formatDateTime(appointment.starts_at)} hs · <span className="font-mono">#{appointment.id}</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5 shrink-0" />
              {appointment.medic.fullname}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {appointment.speciality.name}
            </span>
          </div>

          {canCheckIn(appointment.status) && (
            <div className="pl-12">
              <Button
                onClick={() => checkInAppointment.mutate(appointment.id)}
                disabled={checkInAppointment.isPending && checkInAppointment.variables === appointment.id}
                className="text-xs"
              >
                {checkInAppointment.isPending && checkInAppointment.variables === appointment.id ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Registrar llegada
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Error de check-in */}
          {checkInAppointment.error && (
            <div className="pl-12">
              <div className="animate-in fade-in rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive duration-200 fill-mode-both">
                {checkInAppointment.error.message}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};