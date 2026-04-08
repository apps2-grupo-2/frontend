import axios from 'axios';

import type { OptionsResponse, ProfessionalsResponse } from '@/typings/services/appointments';
import { ENV } from '@/constants';

export const getProfessionals = async (): Promise<ProfessionalsResponse> => {
  try {
    const url = `${ENV.BASE_URL}/professionals`;
    const response = await axios.get<ProfessionalsResponse>(url);
    return response.data;
  } catch (err) {
    console.warn('ERROR ON: getProfessionals');
    console.warn(err);
    return [] as ProfessionalsResponse;
  }
};

export const getSpecialties = async (): Promise<OptionsResponse> => {
  try {
    const url = `${ENV.BASE_URL}/specialties`;
    const response = await axios.get<OptionsResponse>(url);
    return response.data;
  } catch (err) {
    console.warn('ERROR ON: getSpecialties');
    console.warn(err);
    return [] as OptionsResponse;
  }
};

export const getMedicalCenters = async (priority: string): Promise<OptionsResponse> => {
  try {
    const url = `${ENV.BASE_URL}/medical_centers`;
    const response = await axios.get<OptionsResponse>(url, { params: { priority } });
    return response.data;
  } catch (err) {
    console.warn('ERROR ON: getMedicalCenters');
    console.warn(err);
    return [] as OptionsResponse;
  }
};
