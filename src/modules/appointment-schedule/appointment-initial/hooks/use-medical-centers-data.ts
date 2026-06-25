import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import type { AppointmentInitialFormProps } from '@/typings/modules/appointment-initial';
import type { MedicalCentersRequest } from '@/typings/services/medical-centers';
import { PRIORITY_TYPES } from '@/constants';
import { useMedicalCenters } from '@/hooks/use-medical-centers-data';
import { useAuthStore } from '@/stores/auth.store';

export const useMedicalCentersData = (form: UseFormReturn<AppointmentInitialFormProps>) => {
  const authStore = useAuthStore();
  const watchedFields = useWatch({ control: form.control });

  const isProximity = watchedFields.priority === PRIORITY_TYPES.PROXIMITY;
  const isAvailability = watchedFields.priority === PRIORITY_TYPES.AVAILABILITY;

  const params: MedicalCentersRequest = {
    lat: authStore.lat,
    lng: authStore.lng,
    sort_by: isProximity ? 'distance' : 'first_availability',
    ...(isAvailability ? { speciality_id: Number(watchedFields.speciality_id) } : {}),
  };

  const isEnabled = !!watchedFields.priority;

  const medicalCenters = useMedicalCenters(params, isEnabled);
  return medicalCenters;
};