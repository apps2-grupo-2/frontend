import axios from 'axios';

import type { OptionsResponse, SpecialtiesResponse } from '@/typings/services';
import { ENV } from '@/constants';
//import { specialtiesMock } from '@/mocks/specialties.mock';

export const getSpecialities = async (): Promise<OptionsResponse> => {
  try {
    // await new Promise(a => setTimeout(a, 50));
    // return specialtiesMock;
    const url = `${ENV.BASE_URL}/specialities`;
    const response = await axios.get<SpecialtiesResponse>(url);
    const responseParsed = response.data.specialities.map(a => ({
      value: a.id.toString(),
      label: a.name,
    }));
    return responseParsed;
  } catch (err) {
    console.warn('ERROR ON: getSpecialities');
    console.warn(err);
    return [] as OptionsResponse;
  }
};