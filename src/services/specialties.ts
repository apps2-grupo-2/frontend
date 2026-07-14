import type { OptionsResponse } from '@/typings/services';
import { mockGetSpecialities } from '@/mocks/specialties.mock';
import { getMedics } from '@/services/medics';
import { isMockEnabled } from '@/stores/mock.store';

/**
 * Especialidades derivadas del listado GET {BASE_URL}/medics, deduplicando por
 * speciality_id (Francisco, 14/07/2026: "consultar ese nuevo endpoint para las
 * especialidades"). Así el desplegable sólo ofrece especialidades con médicos
 * reservables y los ids coinciden exactos con los del POST /appointments.
 */
export const getSpecialities = async (): Promise<OptionsResponse> => {
  if (isMockEnabled()) return mockGetSpecialities();

  try {
    const medics = await getMedics();
    const byId = new Map<number, string>();
    medics.forEach(m => {
      if (!byId.has(m.speciality_id)) byId.set(m.speciality_id, m.speciality_name);
    });
    return Array.from(byId, ([id, name]) => ({ value: `${id}`, label: name })).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  } catch (err) {
    console.warn('ERROR ON: getSpecialities');
    console.warn(err);
    return [] as OptionsResponse;
  }
};
