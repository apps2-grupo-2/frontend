import type {
  GetMedicalCenterByIdResponse,
  MedicalCenterOptionsResponse,
  MedicalCentersRequest,
} from '@/typings/services/medical-centers';

/**
 * Centros médicos mockeados (modo mock = ENV.USE_MOCKS / switch del login).
 * En modo real salen del backend propio (GET ${ENV.BASE_URL}/medical-centers),
 * que además calcula distance_km según la lat/lng enviada desde el front.
 */
const CENTERS: Array<{ id: number; name: string; city: string; distance_km: number }> = [
  { id: 1, name: 'Centro Médico Norte', city: 'CABA', distance_km: 2.4 },
  { id: 2, name: 'Centro Médico Centro', city: 'CABA', distance_km: 3.1 },
  { id: 3, name: 'Clínica del Sur', city: 'Avellaneda', distance_km: 5.8 },
  { id: 4, name: 'Sanatorio Belgrano', city: 'CABA', distance_km: 7.2 },
  { id: 5, name: 'Hospital del Este', city: 'San Isidro', distance_km: 9.6 },
];

export const mockGetMedicalCenters = async (params: MedicalCentersRequest): Promise<MedicalCenterOptionsResponse> => {
  await new Promise(r => setTimeout(r, 60));
  const ordered =
    params.sort_by === 'name'
      ? [...CENTERS].sort((a, b) => a.name.localeCompare(b.name))
      : [...CENTERS].sort((a, b) => a.distance_km - b.distance_km);
  return ordered.map(c => ({
    value: `${c.id}`,
    label: c.name,
    city: c.city,
    distance_km: c.distance_km,
  }));
};

export const mockGetMedicalCenterById = async (id: string): Promise<GetMedicalCenterByIdResponse> => {
  await new Promise(r => setTimeout(r, 40));
  const found = CENTERS.find(c => `${c.id}` === id);
  return found ? { id: found.id, name: found.name } : ({} as GetMedicalCenterByIdResponse);
};