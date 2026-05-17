import { useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { addDays, addMonths, format } from 'date-fns';

import type { FormContentProps } from '@/typings/modules/appointment-initial';
import type { GetAppointmentsRequest } from '@/typings/services';
import { RhfCalendar } from '@/components/rhf/rhf-calendar';
import { RhfChips } from '@/components/rhf/rhf-chips';
import { RhfCombobox } from '@/components/rhf/rhf-combobox';
import { RhfSelect } from '@/components/rhf/rhf-select';
import { Grid } from '@/components/ui/grid';
import { PRIORITY_TYPES } from '@/constants';
import { useGetAppointments } from '@/hooks/use-appointments-data';
import { useMedicalCenters } from '@/hooks/use-medical-centers-data';
import { useGetProfessionals } from '@/hooks/use-professionals-data';
import { useGetSpecialties } from '@/hooks/use-specialties-data';
import { getCalendarDays, getRangeTimeAvailability } from '../helpers/helpers';

const appointmentsDefaultParams: GetAppointmentsRequest = {
  since: format(addDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
  until: format(addDays(new Date(), 31), 'yyyy-MM-dd HH:mm:ss'), // Próximos 30 días
};

export const FormContent = (props: FormContentProps) => {
  const { form } = props;

  const watchedFields = useWatch({ control: form.control });
  const specialties = useGetSpecialties();
  const medicalCenters = useMedicalCenters(watchedFields.priority || '');
  const professionals = useGetProfessionals(watchedFields.speciality_id || '');

  const [appointmentsParams, _setAppointmentsParams] = useState<GetAppointmentsRequest>(appointmentsDefaultParams);
  const { data: appointments = [], isLoading: isLoadingAppointments } = useGetAppointments(appointmentsParams);

  const enabledDates = getCalendarDays();
  const rangeTimeOptions = useMemo(() => {
    if (!isLoadingAppointments) {
      if (!watchedFields.date) return [];
      const daySelected = format(watchedFields.date as Date, 'yyyy-MM-dd');
      const appointmentsMock = appointments.filter(a => a.starts_at.startsWith(daySelected));
      const occupiedSlots = appointmentsMock.map(a => a.starts_at);
      return getRangeTimeAvailability(watchedFields.date, occupiedSlots);
    }
    return [];
  }, [watchedFields.date, appointments, isLoadingAppointments]);

  const priorityChangeHandler = (_value: string) => {
    form.setValue('medical_center_id', '');
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <RhfCombobox
            control={form.control}
            name="speciality_id"
            rules={{ required: true }}
            label="Especialidad"
            loading={specialties.isLoading}
            placeholder="Seleccione una especialidad"
            disabled={specialties.isLoading}
            options={specialties.data || []}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <RhfSelect
            control={form.control}
            name="priority"
            rules={{ required: true }}
            label="Prioridad"
            placeholder="Seleccione la prioridad"
            disabled={watchedFields.speciality_id === ''}
            onValueChange={priorityChangeHandler}
            options={[
              { value: PRIORITY_TYPES.PROXIMITY, label: 'Por cercanía' },
              { value: PRIORITY_TYPES.AVAILABILITY, label: 'Por primera disponibilidad' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <RhfSelect
            control={form.control}
            name="medical_center_id"
            rules={{ required: true }}
            label="Centro médico"
            loading={medicalCenters.isLoading}
            placeholder="Seleccione un centro médico"
            disabled={!watchedFields.priority}
            options={medicalCenters.data || []}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <RhfCalendar
            control={form.control}
            name="date"
            rules={{ required: true }}
            label="Fecha"
            disabled={!watchedFields.medical_center_id}
            enabledDates={enabledDates}
            startMonth={new Date()}
            endMonth={addMonths(new Date(), 1)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <div className="flex flex-col gap-6">
            {!!watchedFields.date && (
              <RhfChips
                control={form.control}
                name="professional_id"
                label="Profesional"
                options={professionals.data || []}
                rules={{ required: true }}
                disabled={!watchedFields.date}
              />
            )}
            {!!watchedFields.professional_id && (
              <RhfChips
                control={form.control}
                name="starts_at"
                label="Horario"
                options={rangeTimeOptions}
                rules={{ required: true }}
                disabled={!watchedFields.professional_id}
              />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};