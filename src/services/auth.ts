import axios from 'axios';

import type { AuthLoginRequest, AuthLoginResponse } from '@/typings/services/auth';
import { ENV } from '@/constants';
import { MOCK_USERS } from '@/mocks/auth-mock';

const USE_MOCK = true; // Cambiar a false para usar el módulo Core real

export const authLogin = async (body: AuthLoginRequest): Promise<AuthLoginResponse> => {
  if (USE_MOCK) {
    // TODO: reemplazar con POST /auth/sign-in del módulo Core
    // El módulo Core validará credenciales y devolverá un JWT con rol codificado
    await new Promise(r => setTimeout(r, 800)); // simular latencia
    const user = MOCK_USERS.find(
      u => u.dni === body.identifier && u.password === body.password
    );
    if (!user) throw new Error('Credenciales incorrectas');
    return {
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
      email: user.email,
      role: user.role,
      name: user.name,
      subtitle: user.subtitle,
    };
  }

  try {
    const url = `${ENV.BASE_URL}/sign-in`;
    const response = await axios.post<AuthLoginResponse>(url, body);
    return response.data;
  } catch (err) {
    console.log('ERROR ON: authLogin');
    console.log(err);
    throw new Error('Error al iniciar sesión');
  }
};
