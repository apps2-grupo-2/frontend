import axios from 'axios';

import type { MedicsResponse } from '@/typings/services';
import { ENV } from '@/constants';

/**
 * Fuente única de médicos del backend propio (modulo 2 - turnos).
 * GET {BASE_URL}/medics -> { data: Medic[] } (Francisco, 14/07/2026).
 *
 * De acá derivan TANTO el listado de especialidades (deduplicando) COMO el de
 * profesionales por especialidad. Al venir todo del mismo backend, los
 * speciality_id/medic_id quedan siempre consistentes con lo que espera el
 * POST /appointments, y el desplegable de especialidades sólo muestra las que
 * realmente tienen médicos para reservar.
 */
export const getMedics = async (): Promise<MedicsResponse> => {
  const response = await axios.get<MedicsResponse>(`${ENV.BASE_URL}/medics`);
  return response.data ?? [];
};