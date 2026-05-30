import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { addMonths } from 'date-fns';

import type { FormContentProps } from '@/typings/modules/appointment-initial';
import { RhfCalendar } from '@/components/rhf/rhf-calendar';
import { RhfChips } from '@/components/rhf/rhf-chips';
import { RhfCombobox } from '@/components/rhf/rhf-combobox';
import { RhfSelect } from '@/components/rhf/rhf-select';
import { Grid } from '@/components/ui/grid';
import { SelectItem } from '@/components/ui/select';
import { PRIORITY_TYPES } from '@/constants';
import { useGetProfessionals } from '@/hooks/use-professionals-data';
import { useGetSpecialties } from '@/hooks/use-specialties-data';
import { getCalendarDays, getRangeTimeAvailability } from '../helpers/helpers';
import { useGetAppointmentsData } from '../hooks/use-appointments-data';
import { useMedicalCentersData } from '../hooks/use-medical-centers-data';

export const FormContent = (props: FormContentProps) => {
  const { form } = props;
  const watchedFields = useWatch({ control: form.control });
  const specialties = useGetSpecialties();

  const medicalCenters = useMedicalCentersData(form);
  const professionals = useGetProfessionals(watchedFields.speciality_id || '');
  const appointments = useGetAppointmentsData(form);

  const enabledDates = getCalendarDays();
  const rangeTimeOptions = useMemo(() => {
    if (appointments.isLoading || !watchedFields.date || !watchedFields.professional_id) return [];
    return getRangeTimeAvailability(appointments.data.appointments, watchedFields.date);
  }, [watchedFields.date, watchedFields.professional_id, appointments, appointments.isLoading]);

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
          >
            {medicalCenters.data?.map(a => (
              <SelectItem key={a.value} value={a.value} className="px-3 py-2">
                <div className="flex flex-col items-start">
                  <div>{a.label}</div>
                  <div className="text-xs text-gray-500">{a.city}</div>
                </div>
              </SelectItem>
            ))}
          </RhfSelect>
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