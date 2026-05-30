import axios from 'axios';

import type {
  GetMedicalCentersResponse,
  MedicalCenterOptionsResponse,
  MedicalCentersRequest,
} from '@/typings/services/medical-centers';
import { ENV } from '@/constants';

export const getMedicalCenters = async (params: MedicalCentersRequest): Promise<MedicalCenterOptionsResponse> => {
  try {
    const url = `${ENV.BASE_URL}/medical-centers`;
    const response = await axios.get<GetMedicalCentersResponse>(url, { params });
    return response.data.medicalCenters.map(a => ({
      value: `${a.id}`,
      label: a.name,
      city: a.city,
    }));
  } catch (err) {
    console.warn('ERROR ON: getMedicalCenters');
    console.warn(err);
    return [] as MedicalCenterOptionsResponse;
  }
};