import type { ProfessionalsResponse } from '@/typings/services';
import { getMedics } from '@/services/medics';

/**
 * Profesionales por especialidad: se filtran del listado GET {BASE_URL}/medics
 * (Francisco, 14/07/2026). El value = medic_id es el que después viaja en el
 * POST /appointments (medic.id), y el backend de turnos valida que ese usuario
 * tenga rol de médico.
 */
export const getProfessionals = async (specialtyId: string): Promise<ProfessionalsResponse> => {
  try {
    const medics = await getMedics();
    const medicsParsed = medics
      .filter(m => `${m.speciality_id}` === specialtyId)
      .map(m => ({
        value: `${m.medic_id}`,
        label: m.fullname,
        email: m.email,
      }));
    return medicsParsed;
  } catch (err) {
    console.warn('ERROR ON: getProfessionals');
    console.warn(err);
    return [] as ProfessionalsResponse;
  }
};