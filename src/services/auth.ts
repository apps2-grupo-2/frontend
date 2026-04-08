import axios from 'axios';

import type { AuthLoginRequest, AuthLoginResponse } from '@/typings/services/auth';
import { ENV } from '@/constants';

export const authLogin = async (body: AuthLoginRequest) => {
  try {
    const url = `${ENV.BASE_URL}/sign-in`;
    const response = await axios.post<AuthLoginResponse>(url, body);
    return response.data;
  } catch (err) {
    console.log('ERROR ON: authLogin');
    console.log(err);
    throw new Error();
  }
};
