import type { GetPatientsResponse } from '@/typings/services';
import { coreFullName, fetchAllCoreUsers } from '@/services/core-users';

export const getPatientsSearch = async (search: string): Promise<GetPatientsResponse> => {
  if (search.length < 2) return [];

  try {
    const query = search.toLowerCase();
    const users = await fetchAllCoreUsers();
    return users
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
