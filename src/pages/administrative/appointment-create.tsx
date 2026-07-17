import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, CheckCircle, Clock, MapPin, Search, User } from 'lucide-react';

import type { UseAppointmentsData } from '@/typings/hooks/use-appointments';
import type { GetPatientsResponse } from '@/typings/services';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { APPOINTMENTS_STEPS, ROUTES } from '@/constants';
import { useAppointments } from '@/hooks/use-appointments';
import { useGetPatientsSearch } from '@/hooks/use-patients-data/use-patients-data';
import { Appointment_Confirmation } from '@/modules/appointment-schedule/appointment-confirmation';
import { Appointment_Initial } from '@/modules/appointment-schedule/appointment-initial';
import { Stepper } from '@/modules/appointment-schedule/components/stepper';
import { useAppointmentLabels } from '@/modules/appointment-schedule/hooks/use-appointment-labels';

// ─── Tipos ──────────────────────────────────────────────────────────────────

type PatientInfo = {
  id: number;
  fullname: string;
  email: string;
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const { metadata } = useAppointments(APPOINTMENTS_STEPS.APPOINTMENT_INITIAL);
  const { step } = metadata;

  const handlePatientConfirmed = (patient: PatientInfo) => {
    setPatientInfo(patient);
    metadata.setPayload({ ...metadata.payload, patient });
  };

  // ── Paso 0: ingreso de datos del paciente ────────────────────────────────
  if (!patientInfo) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 mx-auto max-w-xl">
        <div className="mb-6 sm:mb-8">
          <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
            Gestión de Turnos
          </p>
          <h1 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">Crear turno</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Ingresá los datos del paciente para continuar
          </p>
        </div>
        <PatientForm onConfirm={handlePatientConfirmed} />
      </div>
    );
  }

  // ── Pasos 1-3: wizard de turno ────────────────────────────────────────────
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300">
      <div className="mb-6 sm:mb-8">
        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
          Gestión de Turnos
        </p>
        <h1 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">Crear turno</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Paciente: <span className="font-medium text-foreground">{patientInfo.fullname}</span>
        </p>
      </div>

      {step !== APPOINTMENTS_STEPS.APPOINTMENT_SUCCESS && (
        <div className="animate-in duration-200 fill-mode-both fade-in">
          <Stepper currentStep={step} />
        </div>
      )}

      <AdminTurnosStep metadata={metadata} />
    </div>
  );
}

// ─── Búsqueda y selección del paciente ───────────────────────────────────────

type PatientOption = GetPatientsResponse[number];

const MAX_RESULTS = 8;

// Ordena por cercanía a lo tipeado (email exacto → empieza-con email → empieza-con
// nombre → contiene) y recorta a los MAX_RESULTS más parecidos, para mostrar solo
// los candidatos relevantes en el dropdown en vez de todo el padrón.
const rankPatients = (results: PatientOption[], query: string): PatientOption[] => {
  const q = query.trim().toLowerCase();
  const score = (r: PatientOption) => {
    const email = (r.subtitle || r.email || '').toLowerCase();
    const name = (r.label || '').toLowerCase();
    if (email === q) return 0;
    if (email.startsWith(q)) return 1;
    if (name.startsWith(q)) return 2;
    if (email.includes(q)) return 3;
    return 4;
  };
  return [...results].sort((a, b) => score(a) - score(b)).slice(0, MAX_RESULTS);
};

type PatientFormProps = {
  onConfirm: (patient: PatientInfo) => void;
};

const PatientForm = ({ onConfirm }: PatientFormProps) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PatientInfo | null>(null);
  const { data: results = [], isFetching } = useGetPatientsSearch(query);

  const options = useMemo(() => rankPatients(results, query), [results, query]);
  const showResults = !selected && query.trim().length >= 2;

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (selected) setSelected(null);
  };

  const handleSelect = (option: PatientOption) => {
    setSelected({ id: Number(option.value), fullname: option.label, email: option.email });
  };

  return (
    <div className="flex flex-col gap-5">
      <Card className="border-border shadow-none">
        <CardContent className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="patient-search" className="text-sm font-medium text-foreground">
              Buscar paciente
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="patient-search"
                type="text"
                autoComplete="off"
                placeholder="Email o nombre del paciente"
                value={query}
                onChange={e => handleQueryChange(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
              />
            </div>
          </div>

          {isFetching && <p className="text-xs text-muted-foreground animate-pulse">Buscando paciente...</p>}

          {showResults && !isFetching && options.length === 0 && (
            <p className="text-xs text-destructive">No se encontró ningún paciente con ese dato.</p>
          )}

          {showResults && options.length > 0 && (
            <ul className="flex max-h-64 flex-col divide-y divide-border overflow-y-auto rounded-lg border border-border">
              {options.map(option => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/60"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{option.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{option.subtitle}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {selected && (
            <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{selected.fullname}</p>
                <p className="truncate text-xs text-muted-foreground">{selected.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="shrink-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Cambiar
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <Button size="lg" className="self-start" disabled={!selected} onClick={() => selected && onConfirm(selected)}>
        Continuar con el turno
      </Button>
    </div>
  );
};

// ─── Router de pasos del wizard ───────────────────────────────────────────────

const AdminTurnosStep = (props: UseAppointmentsData) => {
  const { metadata } = props;
  const { step } = metadata;

  if (step === APPOINTMENTS_STEPS.APPOINTMENT_INITIAL) {
    return <Appointment_Initial metadata={metadata} />;
  }
  if (step === APPOINTMENTS_STEPS.APPOINTMENT_CONFIRMATION) {
    return <Appointment_Confirmation metadata={metadata} />;
  }
  if (step === APPOINTMENTS_STEPS.APPOINTMENT_SUCCESS) {
    return <AdminSuccess metadata={metadata} />;
  }
};

// ─── Pantalla de éxito para el admin ─────────────────────────────────────────

const AdminSuccess = (props: UseAppointmentsData) => {
  const { metadata } = props;
  const navigate = useNavigate();
  const { specialtyLabel, professionalLabel, medicalCenterLabel, dateLabel, rangeTimeLabel } = useAppointmentLabels(
    metadata.payload
  );

  const patientName = metadata.payload.patient?.fullname ?? '—';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 flex flex-col gap-4 max-w-[600px]">
      <Card className="border-border shadow-none">
        <CardContent className="flex flex-col gap-4">
          {/* Header de éxito */}
          <div className="flex flex-col items-center gap-3 pb-4 text-center">
            <div className="animate-in zoom-in-50 fill-mode-both duration-400 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="animate-in zoom-in-75 fill-mode-both delay-150 duration-300 h-12 w-12 text-green-700" />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both delay-200 duration-300">
              <h2 className="text-lg font-bold text-foreground">¡Turno creado!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                El turno fue registrado correctamente para{' '}
                <span className="font-medium text-foreground">{patientName}</span>.
              </p>
            </div>
            <span className="animate-in fade-in fill-mode-both delay-300 duration-300 rounded-full bg-muted px-3 py-1 text-xs font-mono font-semibold text-muted-foreground">
              TUR-{metadata.payload.appointment_id}
            </span>
          </div>

          {/* Detalle del turno */}
          <div className="border-t border-border pt-4 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profesional</p>
                <p className="text-sm font-semibold text-foreground">{professionalLabel}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Especialidad · Centro médico</p>
                <p className="text-sm font-semibold text-foreground">
                  {specialtyLabel} · {medicalCenterLabel}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha y horario</p>
                <p className="text-sm font-semibold capitalize text-foreground">
                  {dateLabel} · {rangeTimeLabel} hs
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <Button size="lg" onClick={() => navigate(ROUTES.PRESENTISMO)}>
          Volver al presentismo
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate(ROUTES.CREAR_TURNO_ADMIN)}>
          <CalendarPlus className="h-4 w-4" />
          Crear otro turno
        </Button>
      </div>
    </div>
  );
};