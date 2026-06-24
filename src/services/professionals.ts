import type { ProfessionalsResponse } from '@/typings/services';
import { professionalsMock } from '@/mocks/professionals.mock';

/**
 * Profesionales: se sirven desde el mock en AMBOS modos (mock y real).
 *
 * Motivo: los médicos los registra el Core (módulo 10), pero su API (GET /users)
 * no expone un filtro por especialidad ni el shape que necesita este combo
 * (value/label/email por specialty_id). Hasta que el Core disponibilice ese
 * endpoint, mantenemos el listado mockeado para no romper el flujo de turnos.
 *
 * Cuando el Core lo exponga, reemplazar el cuerpo por la llamada real (GET al
 * ${ENV.CORE_BASE_URL}/users filtrando por especialidad) detrás de isMockEnabled().
 */
export const getProfessionals = async (specialtyId: string): Promise<ProfessionalsResponse> => {
  try {
    await new Promise(a => setTimeout(a, 50));
    return professionalsMock
      .filter(p => p.specialty_id === specialtyId)
      .map(p => ({ value: p.value, label: `${p.name} (${p.value})`, email: p.email }));
  } catch (err) {
    console.warn('ERROR ON: getProfessionals');
    console.warn(err);
    return [] as ProfessionalsResponse;
  }
};