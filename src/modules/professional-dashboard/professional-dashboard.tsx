import { useState } from 'react';
import { format, isBefore } from 'date-fns';
import { Clock, User } from 'lucide-react';

import type { SlotCardProps } from '@/typings/modules/professional-dashboard';
import type { GetAppointmentsRequest } from '@/typings/services';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { APPOINTMENT_STATUSES } from '@/constants';
import { useConfirmAppointment, useGetAppointments } from '@/hooks/use-appointments-data';
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
  const confirmAppointment = useConfirmAppointment();
  const days = getWeekdaysByOffset(0);
  const [selectedDay, setSelectedDay] = useState<Date>(days[0]);

  const appointmentsParams: GetAppointmentsRequest = {
    since: format(selectedDay, 'yyyy-MM-dd 09:00:00'),
    until: format(selectedDay, 'yyyy-MM-dd 18:00:00'),
    medic_id: authStore.id ? Number(authStore.id) : undefined,
  };
  const isGetAppointmentsEnabled = !!appointmentsParams.medic_id;
  const appointments = useGetAppointments(appointmentsParams, isGetAppointmentsEnabled);
  const totalAppointments = appointments.data?.appointments?.length ?? 0;
  const dayAppointments = getDayAppointments(appointments.data?.appointments, selectedDay);

  const handleConfirm = async (id: number) => {
    try {
      await confirmAppointment.mutateAsync(id);
      appointments.refetch();
    } catch (error) {
      console.error('> Confirm error');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <WeekdaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      <DayStatus totalAppointments={totalAppointments} totalAvailable={18 - totalAppointments} />

      {/* Lista de slots */}
      <Card className="border-border shadow-none">
        <CardContent className="flex flex-col gap-2">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {selectedDay.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          {dayAppointments.map(slot => (
            <SlotCard key={slot.id} slot={slot} onConfirm={handleConfirm} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const SlotCard = (props: SlotCardProps) => {
  const { slot, onConfirm } = props;
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  if (slot.status === 'available') {
    return (
      <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs bg-success/10 border-success/20 text-success">
        <Clock className="h-3 w-3 shrink-0" />
        <span className="font-medium">{format(slot.starts_at, 'HH:mm')}</span>
        <span className="text-success/70">Disponible</span>
      </div>
    );
  }

  const colorClass = statusConfig[slot.status].className;

  const isConfimBtnVisible = slot.status === APPOINTMENT_STATUSES.CHECKED_IN;
  const isConfirmBtnDisabled = isBefore(new Date(), new Date(slot.starts_at));

  return (
    <div className={cn('flex justify-between rounded-lg border px-3 py-2 text-xs', colorClass)}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 shrink-0" />
          <span className="font-semibold">
            {format(slot.starts_at, 'HH:mm')} - {statusConfig[slot.status].label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 pl-5">
          <User className="h-3 w-3 shrink-0 opacity-70" />
          <span className="font-medium">{slot.patient.fullname}</span>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-0.5">
        <span className="ml-auto font-mono opacity-80">TUR-{slot.id}</span>
        {isConfimBtnVisible && (
          <Button
            size="sm"
            variant={isConfirmBtnDisabled ? 'outline' : 'default'}
            disabled={isConfirmBtnDisabled}
            onClick={() => setIsConfirmDialogOpen(true)}
          >
            Completar
          </Button>
        )}
      </div>
      <ConfirmDialog
        title="Confirmar turno"
        description="¿Querés confirmar este turno?"
        ctaTitle="Confirmar"
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={() => onConfirm(slot.id)}
      />
    </div>
  );
};