import axios from 'axios';

import type { MedicsResponse, ProfessionalsResponse } from '@/typings/services';
import { ENV } from '@/constants';
import { professionalsMock } from '@/mocks/professionals.mock';
import { isMockEnabled } from '@/stores/mock.store';

const getProfessionalsMock = async (specialtyId: string): Promise<ProfessionalsResponse> => {
  await new Promise(a => setTimeout(a, 50));
  return professionalsMock
    .filter(p => p.specialty_id === specialtyId)
    .map(p => ({ value: p.value, label: `${p.name} (${p.value})`, email: p.email }));
};

/**
 * Profesionales en modo real: se resuelven contra el nuevo endpoint del
 * backend propio GET {BASE_URL}/medics (Francisco, 14/07/2026). El listado
 * trae medic_id + speciality_id en el mismo espacio de ids que usa turnos,
 * asi que el filtro por especialidad matchea directo (antes se iba al Core
 * y el mapeo de speciality_id no estaba garantizado).
 *
 * El value = medic_id es el que despues viaja en el POST /appointments.
 */
export const getProfessionals = async (specialtyId: string): Promise<ProfessionalsResponse> => {
  if (isMockEnabled()) return getProfessionalsMock(specialtyId);

  try {
    const { data } = await axios.get<MedicsResponse>(`${ENV.BASE_URL}/medics`);
    return (data.data ?? [])
      .filter(m => `${m.speciality_id}` === specialtyId)
      .map(m => ({ value: `${m.medic_id}`, label: m.fullname, email: m.email }));
  } catch (err) {
    console.warn('ERROR ON: getProfessionals');
    console.warn(err);
    return [] as ProfessionalsResponse;
  }
};
