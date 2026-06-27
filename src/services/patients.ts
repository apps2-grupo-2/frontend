import type { GetPatientsResponse } from '@/typings/services';
import { MOCK_USERS_PATIENTS } from '@/mocks/auth-mock';
import { isMockEnabled } from '@/stores/mock.store';
import { coreFullName, fetchAllCoreUsers } from '@/services/core-users';

const getPatientsSearchMock = async (search: string): Promise<GetPatientsResponse> => {
  await new Promise(a => setTimeout(a, 300));
  const patientsFiltered = MOCK_USERS_PATIENTS.filter(({ name, email }) => {
    return (
      email.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase())
    );
  });
  return patientsFiltered.map(a => ({
    value: a.id.toString(),
    label: a.name,
    subtitle: `${a.email} · ${a.subtitle}`,
    email: a.email,
  }));
};

export const getPatientsSearch = async (search: string): Promise<GetPatientsResponse> => {
  if (search.length < 2) return [];

  if (isMockEnabled()) return getPatientsSearchMock(search);

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
