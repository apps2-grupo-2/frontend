import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  MOCK_CALENDAR_PROFESSIONALS,
  MOCK_WEEK_SCHEDULE,
  type ScheduleSlot,
} from '@/mocks/professional-calendar-mock';
import { cn } from '@/lib/utils';

// Semana: 7-11 abr 2026
const WEEK_START = new Date('2026-04-07T00:00:00');

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];

const formatWeekRange = (start: Date) => {
  const end = new Date(start);
  end.setDate(end.getDate() + 4);
  return `${start.getDate()} – ${end.getDate()} ${end.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}`;
};

const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const slotStatusConfig = {
  appointment: {
    confirmed: 'bg-primary/10 border-primary/20 text-primary',
    pending: 'bg-amber-500/10 border-amber-500/20 text-amber-700',
    cancelled: 'bg-muted border-border text-muted-foreground line-through',
  },
  available: 'bg-success/10 border-success/20 text-success',
  blocked: 'bg-muted border-border text-muted-foreground',
};

const SlotCard = ({ slot }: { slot: ScheduleSlot }) => {
  if (slot.type === 'available') {
    return (
      <div className={cn('flex items-center gap-2 rounded-lg border px-3 py-2 text-xs', slotStatusConfig.available)}>
        <Clock className="h-3 w-3 flex-shrink-0" />
        <span className="font-medium">{slot.time}</span>
        <span className="text-success/70">Disponible</span>
      </div>
    );
  }

  if (slot.type === 'blocked') {
    return (
      <div className={cn('flex items-center gap-2 rounded-lg border px-3 py-2 text-xs', slotStatusConfig.blocked)}>
        <Clock className="h-3 w-3 flex-shrink-0" />
        <span className="font-medium">{slot.time}</span>
        <span>Bloqueado</span>
      </div>
    );
  }

  const appt = slot.appointment!;
  const colorClass = slotStatusConfig.appointment[appt.status];

  return (
    <div className={cn('flex flex-col gap-0.5 rounded-lg border px-3 py-2 text-xs', colorClass)}>
      <div className="flex items-center gap-2">
        <Clock className="h-3 w-3 flex-shrink-0" />
        <span className="font-semibold">{slot.time}</span>
        <span className="ml-auto font-mono opacity-60">{appt.id}</span>
      </div>
      <div className="flex items-center gap-1.5 pl-5">
        <User className="h-3 w-3 flex-shrink-0 opacity-70" />
        <span className="font-medium">{appt.patientName}</span>
      </div>
      <p className="pl-5 opacity-70">{appt.specialty} · DNI {appt.patientDni}</p>
    </div>
  );
};

export default function Page() {
  const [selectedProfessional, setSelectedProfessional] = useState(MOCK_CALENDAR_PROFESSIONALS[0].value);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0=Lun ... 4=Vie

  // TODO: reemplazar con GET /professionals/:id/schedule?weekStart=YYYY-MM-DD
  const daySchedule = MOCK_WEEK_SCHEDULE[selectedDayIndex];
  const slots = daySchedule?.slots ?? [];

  const selectedDayDate = new Date(WEEK_START);
  selectedDayDate.setDate(selectedDayDate.getDate() + selectedDayIndex);

  const totalAppointments = slots.filter(s => s.type === 'appointment').length;
  const totalAvailable = slots.filter(s => s.type === 'available').length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300">
      <div className="mb-6 sm:mb-8">
        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
          Gestión de Turnos
        </p>
        <h1 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">
          Agenda Profesional
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Disponibilidad horaria por médico y sede
        </p>
      </div>

      <div className="flex max-w-2xl flex-col gap-5">
        {/* Selector de profesional */}
        {/* TODO: reemplazar con GET /professionals del módulo Core */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Profesional</label>
          <select
            value={selectedProfessional}
            onChange={e => setSelectedProfessional(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 sm:max-w-xs"
          >
            {MOCK_CALENDAR_PROFESSIONALS.map(p => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Navegación de semana */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground capitalize">
            Semana {formatWeekRange(WEEK_START)}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs de días */}
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {DAY_LABELS.map((label, i) => {
            const d = new Date(WEEK_START);
            d.setDate(d.getDate() + i);
            const daySchedule = MOCK_WEEK_SCHEDULE[i];
            const hasAppointments = daySchedule?.slots.some(s => s.type === 'appointment');

            return (
              <button
                key={i}
                onClick={() => setSelectedDayIndex(i)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-2 text-xs transition-colors duration-150',
                  selectedDayIndex === i
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <span className="font-medium">{label}</span>
                <span className={cn('text-xs', selectedDayIndex === i ? 'text-primary-foreground/80' : '')}>
                  {d.getDate()}
                </span>
                {hasAppointments && (
                  <div
                    className={cn(
                      'h-1 w-1 rounded-full',
                      selectedDayIndex === i ? 'bg-primary-foreground/60' : 'bg-primary/60'
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Stats del día */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs">
            <span className="font-semibold text-primary">{totalAppointments}</span>
            <span className="text-muted-foreground">turnos</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-success/5 px-3 py-2 text-xs">
            <span className="font-semibold text-success">{totalAvailable}</span>
            <span className="text-muted-foreground">disponibles</span>
          </div>
        </div>

        {/* Lista de slots */}
        <Card className="border-border shadow-none">
          <CardContent className="flex flex-col gap-2 p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {selectedDayDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            {slots.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Sin agenda para este día.</p>
            ) : (
              slots.map((slot, i) => <SlotCard key={i} slot={slot} />)
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
