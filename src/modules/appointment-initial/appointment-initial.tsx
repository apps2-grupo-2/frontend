import { useForm } from 'react-hook-form';
import { CalendarPlus } from 'lucide-react';

import type { AppointmentInitialFormProps, StepProps } from '@/typings/modules/appointment-initial';
import { FormContent } from './components/form-content';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { APPOINTMENTS_STEPS } from '@/constants';

export const Appointment_Initial = (props: StepProps) => {
  const { metadata } = props;

  const form = useForm<AppointmentInitialFormProps>({
    mode: 'onChange',
    defaultValues: {
      professional: '',
      speciality: '',
      priority: '',
      medicalCenter: '',
      date: undefined,
      rangeTime: '',
    },
  });

  const isFormValid = form.formState.isValid && Object.keys(form.formState.errors).length === 0;

  const onSubmit = async (formData: AppointmentInitialFormProps) => {
    // metadata.payloadRef.current = { ...metadata.payloadRef.current, appointment_initial: formData };
    metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_SUCCESS);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} id="form" className="mb-4">
        <FormContent form={form} />
        <Divider className="mt-8 mb-4" />
        <div className="flex justify-right">
          <Button type="submit" size="xxl" disabled={!isFormValid}>
            <CalendarPlus /> Crear turno
          </Button>
        </div>
      </form>
    </div>
  );
};
