import type { OptionsResponse } from '@/typings/services';

/**
 * Especialidades mockeadas (modo mock = ENV.USE_MOCKS / switch del login).
 * Los ids coinciden con los specialty_id de professionals.mock.ts para que el
 * flujo de "elegir especialidad → elegir profesional" sea consistente offline.
 *
 * En modo real estas salen del backend propio (GET ${ENV.BASE_URL}/specialities).
 */
export const SPECIALTIES_MOCK: Array<{ id: number; name: string; is_high_complexity: number }> = [
  // Baja complejidad
  { id: 2, name: 'Clínica Médica', is_high_complexity: 0 },
  { id: 6, name: 'Cardiología', is_high_complexity: 0 },
  { id: 7, name: 'Dermatología', is_high_complexity: 0 },
  { id: 12, name: 'Endocrinología', is_high_complexity: 0 },
  { id: 26, name: 'Cirugía General', is_high_complexity: 0 },
  // Alta complejidad
  { id: 34, name: 'Densitometría Ósea', is_high_complexity: 1 },
  { id: 35, name: 'Ecocardiograma Doppler', is_high_complexity: 1 },
  { id: 37, name: 'Ergometría', is_high_complexity: 1 },
  { id: 38, name: 'Electroencefalograma', is_high_complexity: 1 },
  { id: 39, name: 'Electromiografía', is_high_complexity: 1 },
  { id: 43, name: 'Angiografía', is_high_complexity: 1 },
  { id: 44, name: 'Biopsia Guiada por Imágenes', is_high_complexity: 1 },
  { id: 46, name: 'Cateterismo Cardíaco', is_high_complexity: 1 },
  { id: 50, name: 'Broncoscopía', is_high_complexity: 1 },
  { id: 51, name: 'Colonoscopía Virtual', is_high_complexity: 1 },
];

export const mockGetSpecialities = async (): Promise<OptionsResponse> => {
  await new Promise(r => setTimeout(r, 50));
  return SPECIALTIES_MOCK.map(s => ({ value: s.id.toString(), label: s.name }));
};