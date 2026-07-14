import axios from 'axios';

import type { ModulesResponse } from '@/typings/services';

export const getModules = async (): Promise<ModulesResponse> => {
  try {
    const url = 'https://da2.mattalbarenque.workers.dev/modules';
    const response = await axios.get<ModulesResponse>(url);
    return response.data;
  } catch (err) {
    console.warn('ERROR ON: getModules');
    console.warn(err);
    return [] as ModulesResponse;
  }
};