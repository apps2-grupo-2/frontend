import type { CoreUser } from '@/services/core-users';
import type { GetPatientsResponse } from '@/typings/services';
import { coreFullName, fetchAllCoreUsers } from '@/services/core-users';

// El listado del Core mezcla todos los roles (médicos, admins, staff, pacientes).
// Para el buscador de pacientes dejamos solo a los que son paciente. Como el Core
// NO embebe roles de forma consistente (algunos users vienen sin `roles`), somos
// tolerantes: si trae rol PATIENT lo incluimos; si no trae roles, no podemos
// descartarlo y lo dejamos; si trae roles pero ninguno es paciente (médico/admin/
// staff), lo excluimos.
const isPatientUser = (u: CoreUser): boolean => {
  const roles = u.roles ?? [];
  if (roles.length === 0) return true;
  return roles.some(r => {
    const name = (r.name ?? '').toLowerCase();
    return name.includes('patient') || name.includes('paciente');
  });
};

export const getPatientsSearch = async (search: string): Promise<GetPatientsResponse> => {
  if (search.length < 2) return [];

  try {
    const query = search.toLowerCase();
    const users = await fetchAllCoreUsers();
    return users
      .filter(isPatientUser)
      .filter(u => coreFullName(u).toLowerCase().includes(query) || (u.email ?? '').toLowerCase().includes(query))
      .map(u => ({
        value: `${u.id}`,
        label: coreFullName(u),
        subtitle: u.email ?? '',
        email: u.email ?? '',
      }));
  } catch (err) {
    console.warn('ERROR ON: getPatientsSearch');
    console.warn(err);
    return [] as GetPatientsResponse;
  }
};