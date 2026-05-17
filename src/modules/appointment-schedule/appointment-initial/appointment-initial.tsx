import { useForm } from 'react-hook-form';
import { CalendarPlus } from 'lucide-react';

import type { AppointmentInitialFormProps, StepProps } from '@/typings/modules/appointment-initial';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { APPOINTMENTS_STEPS } from '@/constants';
import { FormContent } from './components/form-content';

export const Appointment_Initial = (props: StepProps) => {
  const { metadata } = props;

  const form = useForm<AppointmentInitialFormProps>({
    mode: 'onChange',
    defaultValues: {
      professional_id: '',
      speciality_id: '',
      priority: '',
      medical_center_id: '',
      date: '',
      starts_at: '',
    },
  });

  const onSubmit = async (formData: AppointmentInitialFormProps) => {
    const { date, ...rest } = formData;
    metadata.setPayload(rest);
    metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_CONFIRMATION);
  };

  const isFormValid = form.formState.isValid;

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