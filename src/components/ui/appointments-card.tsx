import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, CalendarPlus, CheckCircle2, Clock, MapPin, RefreshCw, X } from 'lucide-react';

import type { AppointmentCardProps, EmptyStateProps } from '@/typings/components/ui/appointments-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { APPOINTMENT_STATUSES } from '@/constants';
import { parseApiDate } from '@/helpers/dates';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from './confirm-dialog';

const statusConfig: Record<
  (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES],
  { label: string; className: string }
> = {
  [APPOINTMENT_STATUSES.ABSENT]: { label: 'Ausente', className: 'bg-orange-500/10 text-orange-600' },
  [APPOINTMENT_STATUSES.CANCELLED]: { label: 'Cancelado', className: 'bg-destructive/10 text-destructive' },
  [APPOINTMENT_STATUSES.CHECKED_IN]: { label: 'En consulta', className: 'bg-primary/10 text-primary' },
  [APPOINTMENT_STATUSES.IN_PROGRESS]: { label: 'En curso', className: 'bg-green-500/10 text-green-700' },
  [APPOINTMENT_STATUSES.COMPLETED]: { label: 'Completado', className: 'bg-emerald-500/10 text-emerald-600' },
  [APPOINTMENT_STATUSES.CONFIRMED]: { label: 'Confirmado', className: 'bg-success/10 text-success' },
  [APPOINTMENT_STATUSES.EXPIRED]: { label: 'Vencido', className: 'bg-muted text-muted-foreground' },
  [APPOINTMENT_STATUSES.PENDING_CONFIRMATION]: { label: 'Pendiente', className: 'bg-amber-500/10 text-amber-600' },
};

export const formatDate = (d: string) => {
  const date = parseApiDate(d);
  return `${format(date, 'dd/MM/yyyy')} a las ${format(date, 'HH:mm')} hs`;
};

// El turno puede confirmarse hasta 24hs antes del starts_at.
// (Antes también se exigía now >= created_at, pero created_at llega en UTC sin
// offset y parseApiDate lo interpreta como hora local, lo que dejaba el botón
// deshabilitado ~3hs tras crear el turno. Ese chequeo era redundante y se quitó.)
const CONFIRM_DEADLINE_HOURS = 24;
export const canConfirmAppointment = (appointment: AppointmentCardProps['appointment']) => {
  if (appointment.status !== APPOINTMENT_STATUSES.PENDING_CONFIRMATION) return false;
  const now = new Date();
  const deadline = new Date(parseApiDate(appointment.starts_at).getTime() - CONFIRM_DEADLINE_HOURS * 60 * 60 * 1000);
  return now <= deadline;
};

export const AppointmentCard = (props: AppointmentCardProps) => {
  const { appointment, onCancel, onConfirm, onReschedule } = props;
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isConfirmTurnDialogOpen, setIsConfirmTurnDialogOpen] = useState(false);

  const isPending = appointment.status === APPOINTMENT_STATUSES.PENDING_CONFIRMATION;
  // Se puede cancelar mientras el turno no haya arrancado ni cerrado: Pendiente o
  // Confirmado. (El back acepta el DELETE desde ambos estados.)
  const canCancel =
    appointment.status === APPOINTMENT_STATUSES.PENDING_CONFIRMATION ||
    appointment.status === APPOINTMENT_STATUSES.CONFIRMED;
  const canConfirm = canConfirmAppointment(appointment);

  return (
    <>
      <Card
        className={cn(
          'animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-200 border-border shadow-none overflow-hidden transition-all hover:border-primary/30 hover:shadow-md shadow-emerald-800/10',
          appointment.status === APPOINTMENT_STATUSES.CANCELLED && 'opacity-60'
        )}
      >
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-200 sm:h-12 sm:w-12">
                <Calendar className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                      {appointment.speciality.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground sm:text-sm">
                      Dr/Dra: {appointment.medic.fullname} ({appointment.medic.id})
                    </p>
                  </div>
                  {statusConfig[appointment.status] && (
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                        statusConfig[appointment.status].className
                      )}
                    >
                      {statusConfig[appointment.status].label}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{formatDate(appointment.starts_at)}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{appointment.medical_center.name}</span>
                  </span>
                </div>
              </div>
            </div>

            {canCancel && (
              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                {isPending && (
                  <>
                    <Button
                      size="sm"
                      className="text-xs"
                      disabled={!canConfirm}
                      title={
                        canConfirm ? undefined : 'El turno se puede confirmar hasta 24hs antes del horario agendado.'
                      }
                      onClick={() => setIsConfirmTurnDialogOpen(true)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Confirmar turno
                    </Button>

                    <Button disabled size="sm" variant="outline" className="text-xs" onClick={onReschedule}>
                      <RefreshCw className="h-3.5 w-3.5" />
                      Reprogramar
                    </Button>
                  </>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setIsConfirmDialogOpen(true)}
                >
                  <X className="h-3.5 w-3.5" />
                  Cancelar turno
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        title="Cancelar turno"
        description="¿Querés cancelar este turno? Esta acción no se puede deshacer."
        ctaTitle="Sí, cancelar"
        ctaVariant="destructive"
        dismissTitle="Deshacer"
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={() => onCancel(appointment.id)}
      />
      <ConfirmDialog
        title="Confirmar turno"
        description="¿Querés confirmar este turno? Se notificará al centro médico."
        ctaTitle="Sí, confirmar"
        dismissTitle="Cancelar"
        open={isConfirmTurnDialogOpen}
        onOpenChange={setIsConfirmTurnDialogOpen}
        onConfirm={() => onConfirm(appointment.id)}
      />
    </>
  );
};

export const EmptyState = (props: EmptyStateProps) => {
  const { onRequest } = props;
  return (
    <div className="flex flex-col bg-amber-50 items-center justify-center rounded-xl border border-dashed border-amber-300 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 border border-amber-300">
        <Calendar className="h-7 w-7 text-amber-500" />
      </div>
      <p className="mt-4 font-semibold text-foreground">Sin turnos próximos</p>
      <p className="mt-1 text-sm text-muted-foreground">No tenés turnos agendados por el momento.</p>
      <Button className="mt-6" onClick={onRequest}>
        <CalendarPlus className="h-4 w-4" />
        Solicitar turno
      </Button>
    </div>
  );
};