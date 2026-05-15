import { Calendar, CalendarPlus, Clock, MapPin, RefreshCw, Video, X } from 'lucide-react';

import type { AppointmentCardProps, EmptyStateProps } from '@/typings/components/ui/appointments-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const formatDate = (dateStr: string) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const statusConfig: Record<string, { label: string; className: string }> = {
  confirmado: { label: 'Confirmado', className: 'bg-success/10 text-success' },
  pendiente: { label: 'Pendiente', className: 'bg-amber-500/10 text-amber-600' },
  cancelado: { label: 'Cancelado', className: 'bg-destructive/10 text-destructive' },
};

export const AppointmentCard = (props: AppointmentCardProps) => {
  const { appointment, index, isCancelling, onCancel, onCancelRequest, onCancelDismiss, onReschedule } = props;

  return (
    <Card
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        'animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 border-border shadow-none transition-all hover:border-primary/20 hover:shadow-md',
        appointment.status === 'cancelado' && 'opacity-60'
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-200 sm:h-12 sm:w-12">
              {appointment.modality === 'virtual' ? (
                <Video className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              ) : (
                <Calendar className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground sm:text-base">{appointment.doctor}</p>
                  <p className="truncate text-xs text-muted-foreground sm:text-sm">{appointment.specialty}</p>
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
                  <span className="truncate">
                    {formatDate(appointment.date)} · {appointment.time} hs
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{appointment.location}</span>
                </span>
              </div>
            </div>
          </div>

          {appointment.status !== 'cancelado' && (
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
              {appointment.modality === 'virtual' && (
                <Button size="sm" className="bg-accent text-xs text-accent-foreground hover:bg-accent/90">
                  Unirse
                </Button>
              )}
              <Button size="sm" variant="outline" className="text-xs" onClick={onReschedule}>
                <RefreshCw className="h-3.5 w-3.5" />
                Reprogramar
              </Button>

              {isCancelling ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">¿Confirmás la cancelación?</span>
                  <Button size="sm" variant="destructive" className="text-xs" onClick={onCancel}>
                    Sí, cancelar
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs" onClick={onCancelDismiss}>
                    No
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={onCancelRequest}
                >
                  <X className="h-3.5 w-3.5" />
                  Cancelar turno
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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