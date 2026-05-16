import type { OptionsResponse } from '@/typings/services';
import { specialtiesMock } from '@/mocks/specialties.mock';

export const getSpecialities = async (): Promise<OptionsResponse> => {
  try {
    // const url = `${ENV.BASE_URL}/specialities`;
    // const response = await axios.get<SpecialtiesResponse>(url);
    // const responseParsed = response.data.specialities.map((a) => ({
    //   value: a.id.toString(),
    //   label: a.name,
    // }));
    // return responseParsed;
    await new Promise(a => setTimeout(a, 50));
    return specialtiesMock;
  } catch (err) {
    console.warn('ERROR ON: getSpecialities');
    console.warn(err);
    return [] as OptionsResponse;
  }
};