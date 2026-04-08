import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Clock } from 'lucide-react';

import type { AppointmentCalendarFormProps, StepProps } from '@/typings/modules/appointment-calendar';
import { StepNavigation } from '@/components/ui/step-navigation';
import { APPOINTMENTS_STEPS } from '@/constants';
import { RhfTabs } from '@/components/rhf/rhf-tabs';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { RhfCombobox } from '@/components/rhf/rhf-combobox';
import { RhfSelect } from '@/components/rhf/rhf-select';

const enabledDates = [new Date(2026, 3, 7), new Date(2026, 3, 10), new Date(2026, 3, 15), new Date(2026, 3, 22)];

const disabledDates = (date: Date) =>
  !enabledDates.some(
    d => d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
  );

export const Appointment_Calendar = (props: StepProps) => {
  const { metadata } = props;
  const { step } = metadata.screen;
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 3, 7));

  const form = useForm<AppointmentCalendarFormProps>({
    mode: 'onChange',
    defaultValues: {
      priority: 'availability',
    },
  });

  // useEffect(() => {
  //   const subscription = form.watch(({ appointmentType }) => {
  //     console.warn(appointmentType);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form.watch]);

  const isFormValid = form.formState.isValid && Object.keys(form.formState.errors).length === 0;

  const tabChangeHandler = (value: string) => {
    console.warn('value:', value);
  };

  const backHandler = () => {
    metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_INITIAL);
  };

  const onSubmit = async (formData: AppointmentCalendarFormProps) => {
    // console.warn('>> formData');
    // console.warn(formData);
    //metadata.payloadRef.current = { appointment_initial: formData };
    //console.warn(metadata.payloadRef.current);
    //metadata.navigateTo(APPOINTMENTS_STEPS.DATETIME_SELECTION);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} id="form" className="mb-4">
        <div className="flex max-w-[500px] flex-col gap-5">
          <div className="flex w-min flex-col overflow-hidden rounded-lg border p-2 shadow-sm">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabledDates}
              className="p-0 [--cell-size:--spacing(12)]"
            />
          </div>
          {/* <RhfCombobox
            controller={{ control: form.control, name: 'speciality', rules: { required: true } }}
            label="Especialidad"
            placeholder="Seleccione una especialidad"
            options={specialitiesMock}
          />
          <RhfSelect
            controller={{ control: form.control, name: 'medicalCenter', rules: { required: true } }}
            label="Centro médico"
            placeholder="Seleccione un centro médico"
            options={[
              { value: '1', label: 'Centro médico Belgrano' },
              { value: '2', label: 'Centro médico Montserrat' },
              { value: '3', label: 'Centro médico Palermo' },
            ]}
          /> */}
        </div>
      </form>

      <StepNavigation
        backBtn={{
          onClick: backHandler,
        }}
      />
    </div>
  );
};
