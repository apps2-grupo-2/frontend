import type { GetPatientsRequest, GetPatientsResponse } from '@/typings/services';
import { MOCK_USERS_PATIENTS } from '@/mocks/auth-mock';

// A ser usada por administracion
export const getPatients = async (params: GetPatientsRequest): Promise<GetPatientsResponse> => {
  try {
    // const url = `${ENV.BASE_URL}/professionals`;
    // const response = await axios.get<ProfessionalsResponse>(url, { params: { specialty_id: specialtyId } });
    // return response.data.professionals.map(p => ({ value: p.id.toString(), label: p.name }));
    await new Promise(a => setTimeout(a, 50));
    const patientsFiltered = MOCK_USERS_PATIENTS.filter(p => {
      if (params.dni && !p.dni.includes(params.dni)) return false;
      if (params.name && !p.name.toLowerCase().includes(params.name.toLowerCase())) return false;
      if (params.email && !p.email.toLowerCase().includes(params.email.toLowerCase())) return false;
      return true;
    });

    return patientsFiltered;
  } catch (err) {
    console.warn('ERROR ON: getPatients');
    console.warn(err);
    return [] as GetPatientsResponse;
  }
};