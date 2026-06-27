import type { ProfessionalsResponse } from '@/typings/services';
import { professionalsMock } from '@/mocks/professionals.mock';
import { isMockEnabled } from '@/stores/mock.store';
import { coreFullName, fetchCoreUsersDetailed, isProfessional } from '@/services/core-users';

const getProfessionalsMock = async (specialtyId: string): Promise<ProfessionalsResponse> => {
  await new Promise(a => setTimeout(a, 50));
  return professionalsMock
    .filter(p => p.specialty_id === specialtyId)
    .map(p => ({ value: p.value, label: `${p.name} (${p.value})`, email: p.email }));
};

export const getProfessionals = async (specialtyId: string): Promise<ProfessionalsResponse> => {
  if (isMockEnabled()) return getProfessionalsMock(specialtyId);

  try {
    const users = await fetchCoreUsersDetailed();
    // NOTA: se asume que el speciality_id del Core coincide con el del backend
    // de turnos (modulo 2). Si no coinciden, este filtro hay que ajustarlo.
    return users
      .filter(u => isProfessional(u.roles))
      .filter(u => (u.specialities ?? []).some(s => `${s.id}` === specialtyId))
      .map(u => ({ value: `${u.id}`, label: coreFullName(u), email: u.email ?? '' }));
  } catch (err) {
    console.warn('ERROR ON: getProfessionals');
    console.warn(err);
    return [] as ProfessionalsResponse;
  }
};
