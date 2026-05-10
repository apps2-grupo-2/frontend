import axios from 'axios';

import type { OptionsResponse, ProfessionalsResponse } from '@/typings/services';
import { ENV } from '@/constants';
import {
  MOCK_MEDICAL_CENTERS,
  MOCK_MEDICAL_CENTERS_AVAILABILITY,
  MOCK_PROFESSIONALS,
} from '@/mocks/appointments-mock';

const USE_MOCK = true; // Cambiar a false para usar el servidor real (npm run local-server)

export const getProfessionals = async (): Promise<ProfessionalsResponse> => {
  if (USE_MOCK) return MOCK_PROFESSIONALS;
  try {
    const url = `${ENV.MOCK_BASE_URL}/professionals`;
    const response = await axios.get<ProfessionalsResponse>(url);
    return response.data;
  } catch (err) {
    console.warn('ERROR ON: getProfessionals');
    console.warn(err);
    return [] as ProfessionalsResponse;
  }
};

export const getMedicalCenters = async (priority: string): Promise<OptionsResponse> => {
  if (USE_MOCK) {
    return priority === 'availability' ? MOCK_MEDICAL_CENTERS_AVAILABILITY : MOCK_MEDICAL_CENTERS;
  }
  try {
    const url = `${ENV.MOCK_BASE_URL}/medical_centers`;
    const response = await axios.get<OptionsResponse>(url, { params: { priority } });
    return response.data;
  } catch (err) {
    console.warn('ERROR ON: getMedicalCenters');
    console.warn(err);
    return [] as OptionsResponse;
  }
};