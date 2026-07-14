import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import { CalendarPlus } from 'lucide-react';

import type { AppointmentsPaginationProps } from '@/typings/modules/appointments/appointments';
import type { GetAppointmentsRequest } from '@/typings/services';
import { AppointmentCard, EmptyState } from '@/components/ui/appointments-card';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ROUTES } from '@/constants';
import { useCancelAppointment, useConfirmAppointment, useGetAppointments } from '@/hooks/use-appointments-data';
import { useAuthStore } from '@/stores/auth.store';

export default function Page() {
  return (
    <div className="animate-in duration-300 fill-mode-both fade-in slide-in-from-bottom-2">
      <div className="mb-6 sm:mb-8">
        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
          Portal del Paciente
        </p>
        <h1 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">Turnos</h1>
      </div>
      <Appointments />
    </div>
  );
}

const Appointments = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const cancelAppointment = useCancelAppointment();
  const confirmAppointment = useConfirmAppointment();
  const areAppointmetsFetched = useRef(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [appointmentsParams, setAppointmentsParams] = useState<GetAppointmentsRequest>({
    since: format(new Date(), 'yyyy-MM-dd 00:00:00'),
    until: format(addDays(new Date(), 30), 'yyyy-MM-dd 00:00:00'),
    patient_id: Number(authStore.id),
    page: 1,
  });
  const appointments = useGetAppointments(appointmentsParams, !!appointmentsParams.patient_id);

  // Cuando se entra por SSO desde otro módulo, authStore.id puede hidratarse
  // DESPUÉS del primer render. appointmentsParams.patient_id se fijó al montar,
  // así que si quedó en NaN la consulta nunca se habilita y la pantalla queda en
  // blanco. Acá lo resincronizamos apenas el id está disponible.
  useEffect(() => {
    const patientId = Number(authStore.id);
    if (patientId && patientId !== appointmentsParams.patient_id) {
      setAppointmentsParams(prev => ({ ...prev, patient_id: patientId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStore.id]);

  useEffect(() => {
    // Esto es para que se reconsulten los turnos
    // cuando vuelve a esta pantalla luego de crear un turno
    if (!areAppointmetsFetched.current) {
      areAppointmetsFetched.current = true;
      appointments.refetch();
    }
  }, [areAppointmetsFetched.current]);

  const handleCancel = async (id: number) => {
    setActionError(null);
    try {
      await cancelAppointment.mutateAsync(id);
      appointments.refetch();
    } catch (error) {
      console.error('> mutateAsync error', error);
      setActionError('No se pudo cancelar el turno. Por favor intentá de nuevo más tarde.');
    }
  };

  const handleConfirm = async (id: number) => {
    setActionError(null);
    try {
      await confirmAppointment.mutateAsync(id);
      appointments.refetch();
    } catch (error) {
      console.error('> confirm error', error);
      setActionError('No se pudo confirmar el turno. Por favor intentá de nuevo más tarde.');
    }
  };

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">Turnos Próximos</h2>
        <Button
          size="lg"
          onClick={() => navigate(ROUTES.SOLICITAR_TURNOS)}
          className="w-full bg-primary text-primary-foreground hover:bg-secondary sm:w-auto"
        >
          <CalendarPlus className="h-4 w-4" />
          Solicitar turno
        </Button>
      </div>

      {appointments.isLoading ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Cargando turnos…
        </div>
      ) : (appointments.data?.appointments?.length ?? 0) === 0 ? (
        <EmptyState onRequest={() => navigate(ROUTES.SOLICITAR_TURNOS)} />
      ) : (
        appointments.data?.appointments?.map(appt => (
          <AppointmentCard
            key={appt.id}
            appointment={appt}
            isLoading={false}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            onReschedule={() => {}}
          />
        ))
      )}

      <AppointmentsPagination
        pagination={appointments?.data?.pagination}
        appointmentsParams={appointmentsParams}
        setAppointmentsParams={setAppointmentsParams}
      />
    </div>
  );
};

const AppointmentsPagination = (props: AppointmentsPaginationProps) => {
  const { pagination, appointmentsParams, setAppointmentsParams } = props;
  // Sin resultados (total_pages = 0) o una sola página no hay nada que paginar:
  // ocultamos el paginador para no dejar "Anterior"/"Siguiente" clickeables al pedo.
  if (!pagination || !appointmentsParams?.page || pagination.total_pages <= 1) return null;

  const handlePageChange = (page: number) => {
    setAppointmentsParams({ ...appointmentsParams, page });
  };

  const totalPages = new Array(pagination.total_pages).fill(0).map((_, idx) => idx + 1);
  const currentPage = appointmentsParams.page;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        </PaginationItem>

        {totalPages.map(page => (
          <PaginationItem key={page}>
            <PaginationLink onClick={() => handlePageChange(page)} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pagination.total_pages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};