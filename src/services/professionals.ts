import type { ProfessionalsResponse } from '@/typings/services';
import { professionalsMock } from '@/mocks/professionals.mock';
import { getMedics } from '@/services/medics';
import { isMockEnabled } from '@/stores/mock.store';

const getProfessionalsMock = async (specialtyId: string): Promise<ProfessionalsResponse> => {
  await new Promise(a => setTimeout(a, 50));
  return professionalsMock
    .filter(p => p.specialty_id === specialtyId)
    .map(p => ({ value: p.value, label: `${p.name} (${p.value})`, email: p.email }));
};

/**
 * Profesionales por especialidad en modo real: se filtran del listado GET
 * {BASE_URL}/medics (Francisco, 14/07/2026). El value = medic_id es el que
 * después viaja en el POST /appointments (medic.id), y el backend de turnos
 * valida que ese usuario tenga rol de médico.
 */
export const getProfessionals = async (specialtyId: string): Promise<ProfessionalsResponse> => {
  if (isMockEnabled()) return getProfessionalsMock(specialtyId);

  try {
    const medics = await getMedics();
    return medics
      .filter(m => `${m.speciality_id}` === specialtyId)
      .map(m => ({ value: `${m.medic_id}`, label: m.fullname, email: m.email }));
  } catch (err) {
    console.warn('ERROR ON: getProfessionals');
    console.warn(err);
    return [] as ProfessionalsResponse;
  }
};
