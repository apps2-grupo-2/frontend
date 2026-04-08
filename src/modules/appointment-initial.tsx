import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { User, Microscope } from 'lucide-react';

import type { AppointmentInitialFormProps, StepProps } from '@/typings/modules/appointment-initial';
import type { OptionsResponse } from '@/typings/services/appointments';
import { StepNavigation } from '@/components/ui/step-navigation';
import { APPOINTMENT_TYPES, APPOINTMENTS_STEPS, PRIORITY_TYPES } from '@/constants';
import { RhfTabs } from '@/components/rhf/rhf-tabs';
import { RhfCombobox } from '@/components/rhf/rhf-combobox';
import { RhfSelect } from '@/components/rhf/rhf-select';
import { useMedicalCenters, useGetProfessionals, useGetSpecialties } from '@/hooks/use-appointments-data';

const tabsOptions = [
  {
    value: APPOINTMENT_TYPES.SPECIALTY,
    title: 'Por especialidad',
    icon: <Microscope />,
  },
  {
    value: APPOINTMENT_TYPES.PROFESSIONAL,
    title: 'Por profesional',
    icon: <User />,
  },
];

export const Appointment_Initial = (props: StepProps) => {
  const { metadata } = props;
  const { data: professionals, isLoading: isLoadingProfessionals } = useGetProfessionals();
  const { data: specialties, isLoading: isLoadingSpecialties } = useGetSpecialties();
  const [specialtiesFiltered, setSpecialtiesFiltered] = useState<OptionsResponse>([]);

  const [isSpecialityDisabled, setIsSpecialityDisabled] = useState(false);
  const [isPriorityDisabled, setIsPriorityDisabled] = useState(true);
  const [isMedicalDisabled, setIsMedicalDisabled] = useState(true);

  const form = useForm<AppointmentInitialFormProps>({
    mode: 'onChange',
    defaultValues: {
      appointmentType: APPOINTMENT_TYPES.SPECIALTY,
      professional: '',
      speciality: '',
      priority: '',
      medicalCenter: '',
    },
  });
  const watchedFields = useWatch({ control: form.control });

  useEffect(() => {
    if (!isLoadingSpecialties && specialties && specialties.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSpecialtiesFiltered(specialties);
    }
  }, [isLoadingSpecialties]);

  const { data: medicalCenters, isLoading: isLoadingMedicalCenters } = useMedicalCenters(watchedFields.priority || '');

  useEffect(() => {
    // Cuando el tipo de turno es "Por especialidad"
    if (watchedFields.appointmentType === APPOINTMENT_TYPES.SPECIALTY) {
      // Si hay alguna especialidad seleccionada, se habilita el campo de prioridad
      if (watchedFields.speciality !== '') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsPriorityDisabled(false);
      }
      // Si hay alguna prioridad seleccionada, se habilita el campo de centro médico
      if (watchedFields.priority !== '') {
        setIsMedicalDisabled(false);
      }
    }
    // Cuando el tipo de turno es "Por profesional"
    if (watchedFields.appointmentType === APPOINTMENT_TYPES.PROFESSIONAL) {
      // Si hay algún profesional seleccionado, se habilita el campo de especialidad
      if (watchedFields.professional !== '') {
        setIsSpecialityDisabled(false);
      }
      // Si hay alguna especialidad seleccionada, se habilita el campo de prioridad
      if (watchedFields.speciality !== '') {
        setIsPriorityDisabled(false);
      }
      // Si hay alguna prioridad seleccionada, se habilita el campo de centro médico
      if (watchedFields.priority !== '') {
        setIsMedicalDisabled(false);
      }
    }
  }, [watchedFields]);

  //const isFormValid = form.formState.isValid && Object.keys(form.formState.errors).length === 0;

  const tabChangeHandler = () => {
    // Al cambiar entre tipo de turno
    // se resetean los campos de la pantalla y se deshabilitan según corresponda
    form.setValue('professional', '');
    form.setValue('speciality', '');
    form.setValue('priority', '');
    form.setValue('medicalCenter', '');
    setIsSpecialityDisabled(form.getValues('appointmentType') === APPOINTMENT_TYPES.PROFESSIONAL);
    setIsPriorityDisabled(true);
    setIsMedicalDisabled(true);

    // Si se cambia de "Por profesional" a "Por especialidad", se cargan todas las especialidades
    if (form.getValues('appointmentType') === APPOINTMENT_TYPES.SPECIALTY) {
      setSpecialtiesFiltered(specialties || []);
    }
  };

  const professionalChangeHandler = (value: string) => {
    const professionalSpecialtyIds = professionals?.find(a => a.value === value)?.specialties || [];
    const professionalSpecialties = specialties?.filter(a => professionalSpecialtyIds.includes(a.value)) || [];
    setSpecialtiesFiltered(professionalSpecialties);
  };
  const priorityChangeHandler = (value: string) => {
    form.setValue('medicalCenter', '');
  };

  const onSubmit = async (formData: AppointmentInitialFormProps) => {
    // console.warn('>> formData');
    // console.warn(formData);
    //metadata.payloadRef.current = { appointment_initial: formData };
    console.warn(metadata.payloadRef.current);
    metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_CALENDAR);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} id="form" className="mb-4">
        <div className="flex max-w-[500px] flex-col gap-5">
          <RhfTabs
            control={form.control}
            name="appointmentType"
            options={tabsOptions}
            onValueChange={tabChangeHandler}
          />
          {watchedFields.appointmentType === APPOINTMENT_TYPES.PROFESSIONAL && (
            <RhfCombobox
              control={form.control}
              name="professional"
              rules={{ required: true }}
              label="Profesional"
              placeholder="Seleccione un profesional"
              disabled={isLoadingProfessionals}
              options={professionals || []}
              onValueChange={professionalChangeHandler}
            />
          )}
          <RhfCombobox
            control={form.control}
            name="speciality"
            rules={{ required: true }}
            label="Especialidad"
            placeholder="Seleccione una especialidad"
            disabled={isLoadingSpecialties || isSpecialityDisabled}
            options={specialtiesFiltered}
          />
          <RhfSelect
            control={form.control}
            name="priority"
            rules={{ required: true }}
            label="Prioridad"
            placeholder="Seleccione la prioridad"
            disabled={isPriorityDisabled}
            onValueChange={priorityChangeHandler}
            options={[
              { value: PRIORITY_TYPES.PROXIMITY, label: 'Por cercanía' },
              { value: PRIORITY_TYPES.AVAILABILITY, label: 'Por primera disponibilidad' },
            ]}
          />
          <RhfSelect
            control={form.control}
            name="medicalCenter"
            rules={{ required: true }}
            label="Centro médico"
            placeholder="Seleccione un centro médico"
            disabled={watchedFields.priority === '' || isMedicalDisabled}
            options={medicalCenters || []}
          />
        </div>
      </form>

      <StepNavigation
        backBtn={{
          disabled: true,
        }}
      />
    </div>
  );
};
