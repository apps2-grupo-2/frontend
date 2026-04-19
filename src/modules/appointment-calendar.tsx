import { useState } from 'react';
import { Clock, CalendarDays } from 'lucide-react';

import type { StepProps } from '@/typings/modules/appointment-calendar';
import { StepNavigation } from '@/components/ui/step-navigation';
import { APPOINTMENTS_STEPS } from '@/constants';
import { Calendar } from '@/components/ui/calendar';
import { MOCK_TIME_SLOTS_BY_DATE, MOCK_ENABLED_DATES } from '@/mocks/appointments-mock';
import { cn } from '@/lib/utils';

const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

export const Appointment_Calendar = (props: StepProps) => {
  const { metadata } = props;
  const [date, setDate] = useState<Date | undefined>(MOCK_ENABLED_DATES[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const dateKey = date ? formatDateKey(date) : '';
  const availableSlots = dateKey ? (MOCK_TIME_SLOTS_BY_DATE[dateKey] ?? []) : [];

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTime('');
  };

  const backHandler = () => {
    metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_INITIAL);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedTime) return;
    // TODO: reemplazar dateKey y selectedTime con respuesta de
    // POST /appointments/reserve { professionalId, specialtyId, centerId, date, time }
  };

  const isValid = !!date && !!selectedTime;

  return (
    <div>
      <form onSubmit={onSubmit} id="form" className="mb-6">
        {/* Layout de dos columnas: calendario | horarios */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[auto_1fr]">
          {/* Columna izquierda — calendario */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="p-0 [--cell-size:--spacing(12)]"
            />
          </div>

          {date && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground capitalize">
                Horarios disponibles · <span className="text-muted-foreground">{formatDateLabel(date)}</span>
              </p>
              {availableSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay horarios disponibles para esta fecha.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={cn(
                        'rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-150',
                        selectedTime === slot
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5'
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Columna derecha — horarios */}
          <div className="flex min-h-[280px] flex-col gap-3">
            {!date ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-6 text-center">
                <CalendarDays className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Seleccioná una fecha para ver los horarios disponibles</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-2 fill-mode-both duration-250 flex flex-col gap-3">
                <div>
                  <p className="text-sm font-semibold capitalize text-foreground">{formatDateLabel(date)}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{availableSlots.length} horarios disponibles</span>
                  </div>
                </div>

                {availableSlots.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
                    <p className="text-sm text-muted-foreground">Sin horarios para esta fecha.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot, idx) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        style={{ animationDelay: `${idx * 40}ms` }}
                        className={cn(
                          'animate-in fade-in zoom-in-95 fill-mode-both duration-200',
                          'rounded-xl border py-3 text-sm font-semibold tracking-wide',
                          'transition-all duration-150 active:scale-[0.95]',
                          selectedTime === slot
                            ? 'border-primary bg-primary text-primary-foreground shadow-md'
                            : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm'
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </form>

      <StepNavigation backBtn={{ onClick: backHandler }} nextBtn={{ disabled: !isValid }} />
    </div>
  );
};
