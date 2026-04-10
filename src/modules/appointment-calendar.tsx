import { useState } from 'react';

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

const disabledDates = (date: Date) =>
  !MOCK_ENABLED_DATES.some(
    d =>
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
  );

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
    metadata.payloadRef.current = {
      ...metadata.payloadRef.current,
      appointment_calendar: { selectedDate: dateKey, selectedTime },
    };
    metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_CONFIRMATION);
  };

  const isValid = !!date && !!selectedTime;

  return (
    <div>
      <form onSubmit={onSubmit} id="form" className="mb-4">
        <div className="flex max-w-[500px] flex-col gap-5">
          <div className="flex w-min flex-col overflow-hidden rounded-lg border p-2 shadow-sm">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={disabledDates}
              className="p-0 [--cell-size:--spacing(12)]"
            />
          </div>

          {date && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium capitalize text-foreground">
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
        </div>
      </form>

      <StepNavigation
        backBtn={{ onClick: backHandler }}
        nextBtn={{ disabled: !isValid }}
      />
    </div>
  );
};
