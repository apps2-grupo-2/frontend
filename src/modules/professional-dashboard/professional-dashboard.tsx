import { useState } from 'react';
import { format, isBefore } from 'date-fns';
import { AlertCircle, Clock, User } from 'lucide-react';

import type { SlotCardProps } from '@/typings/modules/professional-dashboard';
import type { GetAppointmentsRequest } from '@/typings/services';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { APPOINTMENT_STATUSES } from '@/constants';
import { parseApiDate } from '@/helpers/dates';
import { useFinishAppointment, useGetAppointments, useStartAppointment } from '@/hooks/use-appointments-data';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { DayStatus } from './components/day-status';
import { WeekdaySelector } from './components/weekday-selector';
import { getDayAppointments, getWeekdaysByOffset } from './helpers/helpers';

const statusConfig: Record<
  (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES],
  { label: string; className: string }
> = {
  [APPOINTMENT_STATUSES.PENDING_CONFIRMATION]: {
    label: 'Pendiente',
    className: 'bg-amber-300/10 border-amber-600/20 text-amber-600',
  },
  [APPOINTMENT_STATUSES.CONFIRMED]: { label: 'Confirmado', className: 'bg-primary/10 border-primary/20 text-primary' },
  [APPOINTMENT_STATUSES.CHECKED_IN]: { label: 'En consulta', className: 'bg-primary/10 text-primary' },
  [APPOINTMENT_STATUSES.IN_PROGRESS]: { label: 'En curso', className: 'bg-green-500/10 text-green-700' },
  [APPOINTMENT_STATUSES.COMPLETED]: { label: 'Completado', className: 'bg-muted text-muted-foreground' },
  [APPOINTMENT_STATUSES.CANCELLED]: {
    label: 'Cancelado',
    className: 'bg-muted border-border text-muted-foreground line-through',
  },
  [APPOINTMENT_STATUSES.ABSENT]: { label: 'Ausente', className: 'bg-muted text-muted-foreground' },
  [APPOINTMENT_STATUSES.EXPIRED]: { label: 'Vencido', className: 'bg-muted text-muted-foreground' },
};

export const ProfessionalDashboard = () => {
  const authStore = useAuthStore();
  const startAppointment = useStartAppointment();
  const finishAppointment = useFinishAppointment();
  const days = getWeekdaysByOffset(0);
  const [selectedDay, setSelectedDay] = useState<Date>(days[0]);
  const [actionError, setActionError] = useState<string | null>(null);

  const appointmentsParams: GetAppointmentsRequest = {
    since: format(selectedDay, 'yyyy-MM-dd 09:00:00'),
    until: format(selectedDay, 'yyyy-MM-dd 18:00:00'),
    medic_id: authStore.id ? Number(authStore.id) : undefined,
  };
  const isGetAppointmentsEnabled = !!appointmentsParams.medic_id;
  const appointments = useGetAppointments(appointmentsParams, isGetAppointmentsEnabled);
  const totalAppointments = appointments.data?.appointments?.length ?? 0;
  const dayAppointments = getDayAppointments(appointments.data?.appointments, selectedDay);

  const handleStart = async (id: number) => {
    setActionError(null);
    try {
      await startAppointment.mutateAsync(id);
      appointments.refetch();
    } catch (error) {
      console.error('> Start error', error);
      setActionError('No se pudo iniciar la consulta. Intentá de nuevo.');
    }
  };

  const handleFinish = async (id: number) => {
    setActionError(null);
    try {
      await finishAppointment.mutateAsync(id);
      appointments.refetch();
    } catch (error) {
      console.error('> Finish error', error);
      setActionError('No se pudo finalizar la consulta. Intentá de nuevo.');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <WeekdaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      <DayStatus totalAppointments={totalAppointments} totalAvailable={18 - totalAppointments} />

      {actionError && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Lista de slots */}
      <Card className="border-border shadow-none">
        <CardContent className="flex flex-col gap-2">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {selectedDay.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          {dayAppointments.map(slot => (
            <SlotCard key={slot.id} slot={slot} onStart={handleStart} onFinish={handleFinish} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

type SlotCardLocalProps = {
  slot: SlotCardProps['slot'];
  onStart: (id: number) => Promise<void>;
  onFinish: (id: number) => Promise<void>;
};

const SlotCard = ({ slot, onStart, onFinish }: SlotCardLocalProps) => {
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);

  if (slot.status === 'available') {
    return (
      <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs bg-success/10 border-success/20 text-success">
        <Clock className="h-3 w-3 shrink-0" />
        <span className="font-medium">{format(parseApiDate(slot.starts_at), 'HH:mm')}</span>
        <span className="text-success/70">Disponible</span>
      </div>
    );
  }

  const colorClass = statusConfig[slot.status].className;
  const isCheckedIn = slot.status === APPOINTMENT_STATUSES.CHECKED_IN;
  const isInProgress = slot.status === APPOINTMENT_STATUSES.IN_PROGRESS;
  const isSlotInFuture = isBefore(new Date(), parseApiDate(slot.starts_at));

  return (
    <div className={cn('flex justify-between rounded-lg border px-3 py-2 text-xs', colorClass)}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 shrink-0" />
          <span className="font-semibold">
            {format(parseApiDate(slot.starts_at), 'HH:mm')} - {statusConfig[slot.status].label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 pl-5">
          <User className="h-3 w-3 shrink-0 opacity-70" />
          <span className="font-medium">{slot.patient.fullname}</span>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-0.5">
        <span className="ml-auto font-mono opacity-80">TUR-{slot.id}</span>
        {isCheckedIn && (
          <Button
            size="sm"
            variant={isSlotInFuture ? 'outline' : 'default'}
            disabled={isSlotInFuture}
            onClick={() => setIsStartDialogOpen(true)}
          >
            Iniciar
          </Button>
        )}
        {isInProgress && (
          <Button size="sm" onClick={() => setIsFinishDialogOpen(true)}>
            Finalizar
          </Button>
        )}
      </div>

      <ConfirmDialog
        title="Iniciar consulta"
        description="¿Iniciás la consulta con este paciente?"
        ctaTitle="Iniciar"
        open={isStartDialogOpen}
        onOpenChange={setIsStartDialogOpen}
        onConfirm={() => onStart(slot.id)}
      />
      <ConfirmDialog
        title="Finalizar consulta"
        description="¿Confirmás que la consulta fue completada?"
        ctaTitle="Finalizar"
        open={isFinishDialogOpen}
        onOpenChange={setIsFinishDialogOpen}
        onConfirm={() => onFinish(slot.id)}
      />
    </div>
  );
};