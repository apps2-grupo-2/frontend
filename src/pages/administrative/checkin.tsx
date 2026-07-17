import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarPlus, RefreshCw } from 'lucide-react';

import type { AdministrativeCheckInFormProps } from '@/typings/modules/administrative-check-in/administrative-check-in';
import type { GetAppointmentsRequest } from '@/typings/services';
import { Button } from '@/components/ui/button';
import { APPOINTMENT_STATUSES, ROUTES } from '@/constants';
import { useGetAppointments } from '@/hooks/use-appointments-data';
import { cn } from '@/lib/utils';
import { AppointmentList } from '@/modules/administrative-check-in/appointment-list';
import { SearchBar } from '@/modules/administrative-check-in/search-bar';
import { canCheckIn } from '../../modules/administrative-check-in/helpers';

export default function Page() {
  const navigate = useNavigate();

  const form = useForm<AdministrativeCheckInFormProps>({
    mode: 'onChange',
    defaultValues: {
      patientId: '',
    },
  });

  // El buscador es OPCIONAL: si no hay paciente seleccionado mostramos todos los
  // turnos del rango (todos los pacientes). Ojo: el back rechaza patient_id=0/NaN
  // ("must be greater than 0"), por eso solo lo mandamos cuando hay uno válido.
  const patientId = Number(form.watch('patientId'));
  const hasPatient = Number.isFinite(patientId) && patientId > 0;

  const appointmentsParams: GetAppointmentsRequest = {
    since: format(new Date(), 'yyyy-MM-dd 00:00:00'),
    until: format(addDays(new Date(), 30), 'yyyy-MM-dd 00:00:00'),
    page: 1,
    ...(hasPatient ? { patient_id: patientId } : {}),
  };
  const appointments = useGetAppointments(appointmentsParams, true);
  const appointmentsData = appointments.data?.appointments || [];

  const pendingCount = appointmentsData.filter(a => canCheckIn(a.status)).length;
  const arrivedCount = appointmentsData.filter(a => a.status === APPOINTMENT_STATUSES.CHECKED_IN).length;

  const todayLabel = format(new Date(), "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
  const todayLabelCapitalized = todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 mx-auto max-w-2xl">
      <div className="mb-6 sm:mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
            Gestión de Turnos
          </p>
          <h1 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">Presentismo</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Registro de llegada de pacientes · {todayLabelCapitalized}
          </p>
        </div>
        <Button size="sm" className="shrink-0 mt-1" onClick={() => navigate(ROUTES.CREAR_TURNO_ADMIN)}>
          <CalendarPlus className="h-3.5 w-3.5" />
          Crear turno
        </Button>
      </div>

      <div className="flex flex-col gap-5">
        {/* Stats + botón actualizar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-amber-500/5 px-3 py-2 text-xs">
            <span className="font-semibold text-amber-700">{pendingCount}</span>
            <span className="text-muted-foreground">pendientes</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs">
            <span className="font-semibold text-primary">{arrivedCount}</span>
            <span className="text-muted-foreground">presentes</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs">
            <span className="font-semibold text-foreground">{appointmentsData.length}</span>
            <span className="text-muted-foreground">en total</span>
          </div>
          <button
            type="button"
            onClick={() => appointments.refetch()}
            disabled={appointments.isFetching}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', appointments.isFetching && 'animate-spin')} />
            Actualizar
          </button>
        </div>

        {/* Buscador */}
        <SearchBar form={form} />

        {/* Lista de turnos */}
        <AppointmentList appointments={appointments} />
      </div>
    </div>
  );
}