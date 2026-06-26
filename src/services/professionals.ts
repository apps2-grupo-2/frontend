import type { ProfessionalsResponse } from '@/typings/services';
import { professionalsMock } from '@/mocks/professionals.mock';

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