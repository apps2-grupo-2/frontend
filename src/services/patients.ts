import type { GetPatientsResponse } from '@/typings/services';
import { MOCK_USERS_PATIENTS } from '@/mocks/auth-mock';

// A ser usada por administracion
export const getPatientsSearch = async (search: string): Promise<GetPatientsResponse> => {
  try {
    // const url = `${ENV.BASE_URL}/professionals`;
    // const response = await axios.get<ProfessionalsResponse>(url, { params: { specialty_id: specialtyId } });
    // return response.data.professionals.map(p => ({ value: p.id.toString(), label: p.name }));
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