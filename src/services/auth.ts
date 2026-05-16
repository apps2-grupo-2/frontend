import type { AuthLoginRequest, AuthLoginResponse } from '@/typings/services/auth';
import { MOCK_USERS } from '@/mocks/auth-mock';

export const authLogin = async (body: AuthLoginRequest): Promise<AuthLoginResponse> => {
  await new Promise(a => setTimeout(a, 50));
  const user = MOCK_USERS.find(a => a.dni === body.identifier && a.password === body.password);
  if (!user) throw new Error('Credenciales incorrectas');
  return {
    dni: user.dni,
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
    email: user.email,
    role: user.role,
    name: user.name,
    subtitle: user.subtitle,
  };

  // try {
  //   const url = `${ENV.MOCK_BASE_URL}/sign-in`;
  //   const response = await axios.post<AuthLoginResponse>(url, body);
  //   return response.data;
  // } catch (err) {
  //   console.log('ERROR ON: authLogin');
  //   console.log(err);
  //   throw new Error('Error al iniciar sesión');
  // }
};