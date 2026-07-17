import { useState } from 'react';
import { addMinutes, format } from 'date-fns';
import { AlertCircle, Calendar, Clock, MapPin, Stethoscope, User } from 'lucide-react';

import type { StepProps } from '@/typings/modules/appointment-confirmation';
import { Card, CardContent } from '@/components/ui/card';
import { StepNavigation } from '@/components/ui/step-navigation';
import { APPOINTMENTS_STEPS, USER_TYPE } from '@/constants';
import { parseApiDate } from '@/helpers/dates';
import { useConfirmAppointment, useCreateAppointment } from '@/hooks/use-appointments-data';
import { useGetProfessionals } from '@/hooks/use-professionals-data';
import { useAuthStore } from '@/stores/auth.store';
import { useAppointmentLabels } from '../hooks/use-appointment-labels';

export const Appointment_Confirmation = (props: StepProps) => {
  const { metadata } = props;
  const authStore = useAuthStore();
  const professionals = useGetProfessionals(metadata.payload.speciality_id || '0').data || [];
  const { mutateAsync, isPending } = useCreateAppointment();
  const confirmAppointmentMutation = useConfirmAppointment();
  // Los turnos que agenda administración quedan confirmados directamente.
  const isAdmin = authStore.role === USER_TYPE.ADMINISTRATIVE;
  const { specialtyLabel, professionalLabel, medicalCenterLabel, priorityLabel, dateLabel, rangeTimeLabel } =
    useAppointmentLabels(metadata.payload);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const backHandler = () => {
    metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_INITIAL);
  };

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const { payload } = metadata;
    const ends_at_with_30_minutes = addMinutes(parseApiDate(payload.starts_at), 30);
    const ends_at = format(ends_at_with_30_minutes, 'yyyy-MM-dd HH:mm:ss');
    const professional = professionals?.find(a => a.value === payload.professional_id);

    const patientInfo = payload.patient ?? {
      id: Number(authStore.id),
      email: authStore.email || '',
      fullname: authStore.name || '',
    };

    try {
      const { appointment_id } = await mutateAsync({
        appointment: {
          center_id: Number(payload.medical_center_id),
          speciality_id: Number(payload.speciality_id),
          starts_at: payload.starts_at,
          ends_at,
        },
        medic: {
          id: Number(payload.professional_id),
          fullname: professional?.label || '',
          email: professional?.email || '',
        },
        patient: patientInfo,
      });

      // Si lo agenda administración, lo confirmamos en el acto: el paciente no
      // necesita confirmarlo y así el admin puede registrar la llegada sin
      // depender de que el paciente entre (además de esquivar el límite de 24hs
      // de confirmación del paciente). Best-effort: si el confirm falla, igual
      // mostramos el turno creado (queda pendiente).
      if (isAdmin) {
        try {
          await confirmAppointmentMutation.mutateAsync(appointment_id);
        } catch (confirmError) {
          console.warn('> auto-confirmación (admin) falló, el turno queda pendiente', confirmError);
        }
      }

      metadata.setPayload({ ...metadata.payload, appointment_id: `${appointment_id}` });
      metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_SUCCESS);
    } catch (error) {
      console.error('> mutateAsync error', error);
      setSubmitError('No se pudo crear el turno. Verificá que el horario siga disponible e intentá de nuevo.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit} id="form">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">Revisá los datos antes de confirmar el turno.</p>

          {submitError && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex flex-col gap-4 max-w-[600px]">
            <Card className="border-border shadow-none">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Stethoscope className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Especialidad</p>
                    <p className="text-sm font-semibold text-foreground">{specialtyLabel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Profesional</p>
                    <p className="text-sm font-semibold text-foreground">{professionalLabel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Centro médico - ({priorityLabel})</p>
                    <p className="text-sm font-semibold text-foreground">{medicalCenterLabel}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha</p>
                      <p className="text-sm font-semibold capitalize text-foreground">{dateLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Horario</p>
                    <p className="text-sm font-semibold text-foreground">{rangeTimeLabel} hs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <StepNavigation
              backBtn={{ onClick: backHandler }}
              nextBtn={{ disabled: isPending || confirmAppointmentMutation.isPending }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};