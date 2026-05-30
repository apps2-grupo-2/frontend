import { useMemo } from 'react';
import { format } from 'date-fns';

import type { Payload } from '@/typings/hooks/use-appointments';
import { PRIORITY_TYPES } from '@/constants';
import { useMedicalCenterById } from '@/hooks/use-medical-centers-data';
import { useGetProfessionals } from '@/hooks/use-professionals-data';
import { useGetSpecialties } from '@/hooks/use-specialties-data';

export const useAppointmentLabels = (payload: Payload) => {
  const specialties = useGetSpecialties();
  const specialtyLabel = useMemo(() => {
    if (!specialties.isLoading && specialties.data) {
      return specialties.data.find(a => a.value === payload.speciality_id)?.label || '';
    }
    return '';
  }, [specialties.isLoading, specialties.data, payload.speciality_id]);

  const professionals = useGetProfessionals(payload.speciality_id);
  const professionalLabel = useMemo(() => {
    if (!professionals.isLoading && professionals.data) {
      return professionals.data.find(a => a.value === payload.professional_id)?.label || '';
    }
    return '';
  }, [professionals.isLoading, professionals.data, payload.professional_id]);

  const medicalCenter = useMedicalCenterById(payload.medical_center_id);
  const medicalCenterLabel = medicalCenter.data?.name || '';

  const priorityLabel = payload.priority === PRIORITY_TYPES.PROXIMITY ? 'Por cercanía' : 'Por primera disponibilidad';
  const dateLabel = format(payload.starts_at, 'dd/MM/yyyy');
  const rangeTimeLabel = format(payload.starts_at, 'HH:mm');

  return { specialtyLabel, professionalLabel, medicalCenterLabel, priorityLabel, dateLabel, rangeTimeLabel };
};