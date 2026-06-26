import axios from 'axios';

import type { OptionsResponse, SpecialtiesResponse } from '@/typings/services';
import { ENV } from '@/constants';

export const getSpecialities = async (): Promise<OptionsResponse> => {
  try {
    const url = `${ENV.BASE_URL}/specialities`;

    const first = await axios.get<SpecialtiesResponse>(url, { params: { page: 1 } });
    const { total_pages } = first.data.pagination;

    let allSpecialities = first.data.specialities;

    if (total_pages > 1) {
      const remaining = await Promise.all(
        Array.from({ length: total_pages - 1 }, (_, i) =>
          axios.get<SpecialtiesResponse>(url, { params: { page: i + 2 } }).then(r => r.data.specialities)
        )
      );
      allSpecialities = allSpecialities.concat(...remaining);
    }

    return allSpecialities.map(a => ({
      value: a.id.toString(),
      label: a.name,
    }));
  } catch (err) {
    console.warn('ERROR ON: getSpecialities');
    console.warn(err);
    return [] as OptionsResponse;
  }
};