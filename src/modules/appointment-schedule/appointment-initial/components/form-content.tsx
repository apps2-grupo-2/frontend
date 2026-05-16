import { useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { addMonths } from 'date-fns';

import type { FormContentProps } from '@/typings/modules/appointment-initial';
import type { AppointmentsRequest } from '@/typings/services';
import { RhfCalendar } from '@/components/rhf/rhf-calendar';
import { RhfChips } from '@/components/rhf/rhf-chips';
import { RhfCombobox } from '@/components/rhf/rhf-combobox';
import { RhfSelect } from '@/components/rhf/rhf-select';
import { Grid } from '@/components/ui/grid';
import { PRIORITY_TYPES } from '@/constants';
import { useGetAppointments } from '@/hooks/use-appointments-data';
import { useMedicalCenters } from '@/hooks/use-medical-centers-data';
import { useGetSpecialties } from '@/hooks/use-specialties-data';
import { getCalendarDays, getRangeTimeAvailability } from '../helpers/helpers';

const professionalOptions = [
  { value: 'p1', label: 'Dr. Juan Perez' },
  { value: 'p2', label: 'Dra. Maria Lopez' },
];

const appointmentsDefaultParams: AppointmentsRequest = {
  // since: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  since: '2026-04-10 00:00:00',
  // until: format(addDays(new Date(), 30), 'yyyy-MM-dd HH:mm:ss'), // Próximos 30 días
  until: '2026-05-10 00:00:00',
};

export const FormContent = (props: FormContentProps) => {
  const { form } = props;

  const watchedFields = useWatch({ control: form.control });
  const { data: specialties = [], isLoading: isLoadingSpecialties } = useGetSpecialties();
  const { data: medicalCenters, isLoading: isLoadingMedicalCenters } = useMedicalCenters(watchedFields.priority || '');

  const [appointmentsParams, _setAppointmentsParams] = useState<AppointmentsRequest>(appointmentsDefaultParams);
  const { data: appointments, isLoading: isLoadingAppointments } = useGetAppointments(appointmentsParams, true);

  const priorityChangeHandler = (_value: string) => {
    form.setValue('medicalCenter', '');
  };

  const enabledDates = getCalendarDays();
  const rangeTimeOptions = useMemo(() => {
    if (!isLoadingAppointments) {
      // TODO: reemplazar occupiedSlots con appointments > starts_at cuando devuelva
      // horarios finalizados en rangos de media hora, ahora mismo estan como:
      // starts_at: "2026-04-11 01:22:00" y no funcionaria
      const occupiedSlots = ['2026-05-16 11:30:00', '2026-05-16 15:00:00'];
      return getRangeTimeAvailability(new Date(), occupiedSlots);
    }
    return [];
  }, [appointments, isLoadingAppointments]);

  console.warn('rangeTimeOptions');
  console.warn(rangeTimeOptions);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <RhfCombobox
            control={form.control}
            name="speciality"
            rules={{ required: true }}
            label="Especialidad"
            loading={isLoadingSpecialties}
            placeholder="Seleccione una especialidad"
            disabled={isLoadingSpecialties}
            options={specialties}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <RhfSelect
            control={form.control}
            name="priority"
            rules={{ required: true }}
            label="Prioridad"
            placeholder="Seleccione la prioridad"
            disabled={watchedFields.speciality === ''}
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
            name="medicalCenter"
            rules={{ required: true }}
            label="Centro médico"
            loading={isLoadingMedicalCenters}
            placeholder="Seleccione un centro médico"
            disabled={watchedFields.priority === ''}
            options={medicalCenters || []}
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
            //disabled={watchedFields.medicalCenter === ''}
            enabledDates={enabledDates}
            startMonth={new Date()}
            endMonth={addMonths(new Date(), 1)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          {!!watchedFields.date && (
            <div className="flex flex-col gap-6">
              <RhfChips
                control={form.control}
                name="professional"
                label="Profesional"
                options={professionalOptions}
                rules={{ required: true }}
                disabled={!watchedFields.date}
              />
              <RhfChips
                control={form.control}
                name="rangeTime"
                label="Horario"
                options={rangeTimeOptions}
                rules={{ required: true }}
                disabled={!watchedFields.professional}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};