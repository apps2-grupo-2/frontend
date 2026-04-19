import { useWatch } from 'react-hook-form';

import type { FormContentProps } from '@/typings/modules/appointment-initial';
import { useMedicalCenters, useGetSpecialties } from '@/hooks/use-appointments-data';
import { Grid } from '@/components/ui/grid';
import { RhfChips } from '@/components/rhf/rhf-chips';
import { RhfCombobox } from '@/components/rhf/rhf-combobox';
import { RhfSelect } from '@/components/rhf/rhf-select';
import { RhfCalendar } from '@/components/rhf/rhf-calendar';
import { PRIORITY_TYPES } from '@/constants';
import { MOCK_ENABLED_DATES } from '@/mocks/appointments-mock';

const professionalOptions = [
  { value: 'p1', label: 'Dr. Juan Perez' },
  { value: 'p2', label: 'Dra. Maria Lopez' },
];

const rangeTimeOptions = [
  { value: 'a1', label: '8:00 - 8:30' },
  { value: 'a2', label: '8:30 - 9:00' },
  { value: 'a3', label: '9:00 - 9:30' },
];

export const FormContent = (props: FormContentProps) => {
  const { form } = props;

  const { data: specialties = [], isLoading: isLoadingSpecialties } = useGetSpecialties();

  const watchedFields = useWatch({ control: form.control });

  const { data: medicalCenters, isLoading: isLoadingMedicalCenters } = useMedicalCenters(watchedFields.priority || '');

  const priorityChangeHandler = (value: string) => {
    form.setValue('medicalCenter', '');
  };

  const disabledDates = (date: Date) =>
    !MOCK_ENABLED_DATES.some(
      d => d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
    );

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
            disabled={watchedFields.medicalCenter === ''}
            disabledDates={disabledDates}
            startMonth={new Date()}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
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
        </Grid>
      </Grid>
    </div>
  );
};
