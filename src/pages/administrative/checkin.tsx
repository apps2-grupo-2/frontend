import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarPlus, CheckCircle2, Clock, Loader2, MapPin, RefreshCw, Search, User } from 'lucide-react';

import type { AdministrativeCheckInFormProps } from '@/typings/modules/administrative-check-in/administrative-check-in';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { APPOINTMENT_STATUSES, ROUTES } from '@/constants';
import { cn } from '@/lib/utils';
import { SearchBar } from '@/modules/administrative-check-in/search-bar';
import { checkInAppointment, getAppointments } from '@/services/appointments';
import { canCheckIn, extractTime, getTodayRange, statusConfig } from './helpers';

const CHECKIN_QUERY_KEY = 'checkin-appointments';

export default function Page() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const { since, until } = getTodayRange();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [CHECKIN_QUERY_KEY, since, until],
    queryFn: () => getAppointments({ since, until }),
    staleTime: 30 * 1000,
    retry: false,
  });

  const [checkInError, setCheckInError] = useState<string | null>(null);

  const {
    mutate: doCheckIn,
    isPending: isCheckingIn,
    variables: checkingInId,
  } = useMutation({
    mutationFn: (id: number) => checkInAppointment(id),
    onSuccess: () => {
      setCheckInError(null);
      queryClient.invalidateQueries({ queryKey: [CHECKIN_QUERY_KEY] });
    },
    onError: () => {
      setCheckInError(
        'No se pudo registrar la llegada. Verificá que el turno esté en estado válido e intentá de nuevo.'
      );
    },
  });

  const appointments = data?.appointments ?? [];

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      a.patient.fullname.toLowerCase().includes(q) ||
      a.medic.fullname.toLowerCase().includes(q) ||
      String(a.id).includes(q)
    );
  });

  const form = useForm<AdministrativeCheckInFormProps>({
    mode: 'onChange',
    defaultValues: {
      search: '',
    },
  });

  const pendingCount = appointments.filter(a => canCheckIn(a.status)).length;
  const arrivedCount = appointments.filter(a => a.status === APPOINTMENT_STATUSES.CHECKED_IN).length;

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
            <span className="font-semibold text-foreground">{appointments.length}</span>
            <span className="text-muted-foreground">total del día</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            Actualizar
          </button>
        </div>

        {/* Buscador */}
        <div>
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre del paciente, médico o N° de turno..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>
        <SearchBar form={form} />

        {/* Error de check-in */}
        {checkInError && (
          <div className="animate-in fade-in rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive duration-200 fill-mode-both">
            {checkInError}
          </div>
        )}

        {/* Lista de turnos */}
        <div className="flex flex-col gap-3">
          {isLoading && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Cargando turnos del día...</p>
            </div>
          )}

          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 py-12 text-center">
              <p className="text-sm font-medium text-foreground">No se pudieron cargar los turnos</p>
              <p className="mt-1 text-xs text-muted-foreground">Verificá tu conexión e intentá de nuevo.</p>
              <Button size="sm" variant="outline" className="mt-4 text-xs" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <Search className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                {search ? 'Sin resultados' : 'No hay turnos para hoy'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {search
                  ? 'Probá con otro nombre o N° de turno.'
                  : 'No se encontraron turnos programados para el día de hoy.'}
              </p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            filtered.map((appt, idx) => (
              <Card
                key={appt.id}
                style={{ animationDelay: `${idx * 40}ms` }}
                className={cn(
                  'animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 border-border shadow-none transition-all',
                  appt.status === APPOINTMENT_STATUSES.COMPLETED && 'opacity-50',
                  appt.status === APPOINTMENT_STATUSES.CHECKED_IN && 'border-primary/30'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                          {appt.patient.fullname
                            .split(' ')
                            .slice(0, 2)
                            .map(n => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{appt.patient.fullname}</p>
                          <p className="text-xs text-muted-foreground">{appt.patient.email}</p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                          statusConfig[appt.status].className
                        )}
                      >
                        {statusConfig[appt.status].label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 pl-12">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {extractTime(appt.starts_at)} hs · <span className="font-mono">#{appt.id}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="h-3.5 w-3.5 shrink-0" />
                        {appt.medic.fullname}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {appt.speciality.name}
                      </span>
                    </div>

                    {canCheckIn(appt.status) && (
                      <div className="pl-12">
                        <Button
                          size="sm"
                          className="text-xs"
                          disabled={isCheckingIn && checkingInId === appt.id}
                          onClick={() => doCheckIn(appt.id)}
                        >
                          {isCheckingIn && checkingInId === appt.id ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Registrando...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Registrar llegada
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}