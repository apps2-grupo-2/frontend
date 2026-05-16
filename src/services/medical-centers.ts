import type { OptionsResponse } from '@/typings/services';
import { MOCK_MEDICAL_CENTERS, MOCK_MEDICAL_CENTERS_AVAILABILITY } from '@/mocks/appointments-mock';

export const getMedicalCenters = async (priority: 'availability' | string): Promise<OptionsResponse> => {
  return priority === 'availability' ? MOCK_MEDICAL_CENTERS_AVAILABILITY : MOCK_MEDICAL_CENTERS;

  // try {
  //   const url = `${ENV.MOCK_BASE_URL}/medical_centers`;
  //   const response = await axios.get<OptionsResponse>(url, { params: { priority } });
  //   return response.data;
  // } catch (err) {
  //   console.warn('ERROR ON: getMedicalCenters');
  //   console.warn(err);
  //   return [] as OptionsResponse;
  // }
};