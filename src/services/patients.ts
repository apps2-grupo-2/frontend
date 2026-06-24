import type { GetPatientsResponse } from '@/typings/services';
import { MOCK_USERS_PATIENTS } from '@/mocks/auth-mock';

/**
 * Búsqueda de pacientes (usada por administración para crear turnos).
 * Se sirve desde el mock en AMBOS modos (mock y real).
 *
 * Motivo: los pacientes los registra el Core (módulo 10), pero su API (GET /users)
 * no expone una búsqueda por email/nombre con este shape. Hasta que el Core lo
 * disponibilice, mantenemos la búsqueda mockeada para no romper el alta de turnos.
 *
 * Cuando el Core lo exponga, reemplazar por la llamada real (GET al
 * ${ENV.CORE_BASE_URL}/users con búsqueda) detrás de isMockEnabled().
 */
export const getPatientsSearch = async (search: string): Promise<GetPatientsResponse> => {
  try {
    await new Promise(a => setTimeout(a, 300));
    if (search.length < 2) {
      return [];
    }
    const patientsFiltered = MOCK_USERS_PATIENTS.filter(({ name, email }) => {
      return (
        email.toLowerCase().includes(search.toLowerCase()) ||
        name.toLowerCase().includes(search.toLowerCase())
      );
    });
    const patientsMapped = patientsFiltered.map(a => ({
      value: a.id.toString(),
      label: a.name,
      subtitle: `${a.email} · ${a.subtitle}`,
      email: a.email,
    }));
    return patientsMapped;
  } catch (err) {
    console.warn('ERROR ON: getPatientsSearch');
    console.warn(err);
    return [] as GetPatientsResponse;
  }
};