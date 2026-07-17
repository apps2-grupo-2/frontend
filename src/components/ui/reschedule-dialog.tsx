import { useState } from 'react';
import { addDays, addMinutes, format, isWeekend } from 'date-fns';
import { es } from 'react-day-picker/locale';
import { AlertCircle, Loader2 } from 'lucide-react';

import type { Appointment } from '@/typings/services';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { APPOINTMENT_STATUSES } from '@/constants';
import { parseApiDate } from '@/helpers/dates';
import { useConfirmAppointment, useGetAppointments, useRescheduleAppointment } from '@/hooks/use-appointments-data';
import { cn } from '@/lib/utils';

type RescheduleDialogProps = {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Se llama al reprogramar con éxito (para refrescar la lista de turnos).
  onRescheduled: () => void;
};

// Días habilitados: próximos 31 días, sin fines de semana (igual que el alta de turno).
const getEnabledDates = (): Date[] =>
  Array.from({ length: 31 }, (_, i) => addDays(new Date(), i + 1)).filter(d => !isWeekend(d));

// Slots de 30' entre 09:00 y 18:00 para el día elegido, descartando los horarios
// que el médico ya tiene ocupados.
const buildSlots = (date: Date, occupied: string[]): { label: string; value: string }[] => {
  const slots: { label: string; value: string }[] = [];
  for (let hour = 9; hour < 18; hour++) {
    for (const minutes of [0, 30]) {
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minutes);
      const end = addMinutes(start, 30);
      const value = format(start, 'yyyy-MM-dd HH:mm:ss');
      if (occupied.includes(value)) continue;
      slots.push({ label: `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`, value });
    }
  }
  return slots;
};

export const RescheduleDialog = (props: RescheduleDialogProps) => {
  const { appointment, open, onOpenChange, onRescheduled } = props;
  const reschedule = useRescheduleAppointment();
  const confirm = useConfirmAppointment();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Turnos del médico en el día elegido → para no ofrecer horarios ya ocupados.
  const dayAppointments = useGetAppointments(
    {
      medic_id: appointment.medic.id,
      since: selectedDate ? format(selectedDate, 'yyyy-MM-dd 09:00:00') : '',
      until: selectedDate ? format(selectedDate, 'yyyy-MM-dd 18:00:00') : '',
    },
    open && !!selectedDate
  );
  const occupied = (dayAppointments.data?.appointments ?? []).map(a => a.starts_at);

  const enabledDates = getEnabledDates();
  const isDateDisabled = (date: Date) =>
    !enabledDates.some(
      d => d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
    );

  const slots = selectedDate ? buildSlots(selectedDate, occupied) : [];
  const loadingSlots = dayAppointments.isFetching;
  const isBusy = reschedule.isPending || confirm.isPending;

  const reset = () => {
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setError(null);
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;
    setError(null);
    const ends_at = format(addMinutes(parseApiDate(selectedSlot), 30), 'yyyy-MM-dd HH:mm:ss');
    reschedule.mutate(
      { id: appointment.id, body: { starts_at: selectedSlot, ends_at } },
      {
        onSuccess: async () => {
          // El back deja el turno en Pendiente tras reprogramar. Si venía
          // Confirmado, lo re-confirmamos para que siga confirmado.
          if (appointment.status === APPOINTMENT_STATUSES.CONFIRMED) {
            try {
              await confirm.mutateAsync(appointment.id);
            } catch {
              // Si el re-confirm falla, queda pendiente y el paciente lo confirma.
            }
          }
          onRescheduled();
          handleOpenChange(false);
        },
        onError: () => {
          setError('No se pudo reprogramar. Puede que el horario ya esté ocupado; probá con otro.');
        },
      }
    );
  };

  const currentLabel = `${format(parseApiDate(appointment.starts_at), 'dd/MM/yyyy')} a las ${format(
    parseApiDate(appointment.starts_at),
    'HH:mm'
  )} hs`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reprogramar turno</DialogTitle>
          <DialogDescription>
            {appointment.speciality.name} · Dr/Dra {appointment.medic.fullname}. Turno actual: {currentLabel}. Elegí una
            nueva fecha y horario.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-lg border border-border bg-white p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelectDate}
              disabled={isDateDisabled}
              locale={es}
              weekStartsOn={0}
              className="bg-white p-0"
            />
          </div>

          {selectedDate && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">Horario</p>
              {loadingSlots ? (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Cargando horarios disponibles...
                </p>
              ) : slots.length === 0 ? (
                <p className="text-xs text-muted-foreground">No hay horarios disponibles ese día. Probá con otro.</p>
              ) : (
                <div className="grid max-h-40 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
                  {slots.map(slot => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setSelectedSlot(slot.value)}
                      className={cn(
                        'rounded-lg border px-2 py-1.5 text-xs transition-colors',
                        selectedSlot === slot.value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-foreground hover:border-primary/40 hover:bg-muted'
                      )}
                    >
                      {format(parseApiDate(slot.value), 'HH:mm')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isBusy}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedSlot || isBusy}>
            {isBusy ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Reprogramando...
              </>
            ) : (
              'Confirmar nuevo turno'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
