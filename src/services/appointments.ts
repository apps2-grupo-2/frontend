import axios from 'axios';

import type { AppointmentsRequest, AppointmentsResponse } from '@/typings/services';
import { ENV } from '@/constants';

export const getAppointments = async (req: AppointmentsRequest): Promise<AppointmentsResponse['appointments']> => {
  try {
    const url = `${ENV.BASE_URL}/appointments`;
    const response = await axios.get<AppointmentsResponse>(url, { params: req });
    return response.data.appointments;
  } catch (err) {
    console.warn('ERROR ON: getAppointments');
    console.warn(err);
    return [] as unknown as AppointmentsResponse['appointments']; // Retorna un array vacío en caso de error para evitar que la app se rompa. Idealmente, manejar este error de forma más robusta (ej: mostrar mensaje al usuario).
  }
};