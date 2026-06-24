import axios from 'axios';

import type {
  GetMedicalCenterByIdResponse,
  GetMedicalCentersResponse,
  MedicalCenterOptionsResponse,
  MedicalCentersRequest,
} from '@/typings/services/medical-centers';
import { ENV } from '@/constants';
import { mockGetMedicalCenterById, mockGetMedicalCenters } from '@/mocks/medical-centers.mock';
import { isMockEnabled } from '@/stores/mock.store';

export const getMedicalCenters = async (params: MedicalCentersRequest): Promise<MedicalCenterOptionsResponse> => {
  if (isMockEnabled()) return mockGetMedicalCenters(params);
  try {
    const url = `${ENV.BASE_URL}/medical-centers`;
    const response = await axios.get<GetMedicalCentersResponse>(url, { params });
    return response.data.medical_centers.map(a => ({
      value: `${a.id}`,
      label: a.name,
      city: a.city,
      distance_km: a.distance_km,
    }));
  } catch (err) {
    console.warn('ERROR ON: getMedicalCenters');
    console.warn(err);
    return [] as MedicalCenterOptionsResponse;
  }
};

export const getMedicalCenterById = async (id: string): Promise<GetMedicalCenterByIdResponse> => {
  if (isMockEnabled()) return mockGetMedicalCenterById(id);
  try {
    const url = `${ENV.BASE_URL}/medical-centers/${id}`;
    const response = await axios.get<GetMedicalCenterByIdResponse>(url);
    return response.data;
  } catch (err) {
    console.warn('ERROR ON: getMedicalCenterById - id: ', id);
    console.warn(err);
    return {} as GetMedicalCenterByIdResponse;
  }
};