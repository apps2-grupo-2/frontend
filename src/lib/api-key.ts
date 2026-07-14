import axios from 'axios';

import { ENV, ROUTES } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Interceptor global para el backend propio (modulo 2 - turnos).
 *
 * El core exige que TODAS las peticiones al back lleven el header
 * `x-api-key: appointments-secret-key`; sin eso el back las rechaza.
 * Ademas, una vez hecho el "giro" de SSO (ver src/pages/auth-sso.tsx +
 * establishSessionFromTicket en services/auth.ts), la sesion se transporta
 * como `Authorization: Bearer <access_token>`.
 *
 * Se aplica SOLO a las requests que van a ENV.BASE_URL. Al core
 * (ENV.CORE_BASE_URL: login, users, sso-exchange) NO se le manda la api-key
 * para no romper el preflight CORS: el core no la espera.
 *
 * Los services usan el axios global por defecto, asi que registramos el
 * interceptor sobre esa instancia. Este modulo se importa una sola vez en
 * main.tsx para que quede activo en el bootstrap.
 */
const isOwnBackend = (url?: string): boolean => !!url && url.startsWith(ENV.BASE_URL);

axios.interceptors.request.use(config => {
  if (isOwnBackend(config.url)) {
    config.headers.set('x-api-key', ENV.API_KEY);

    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }
  return config;
});

/**
 * Manejo de sesión vencida: si el backend propio responde 401 (JWT vencido o
 * inválido), limpiamos la sesión y mandamos al login. Se scopea a ENV.BASE_URL
 * para no interferir con los 401 de auth del core (login fallido, ticket SSO
 * inválido), que se manejan localmente en sus pantallas.
 */
axios.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;
    const url: string | undefined = error?.config?.url;
    if (status === 401 && isOwnBackend(url)) {
      useAuthStore.getState().resetStore();
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.assign(ROUTES.LOGIN);
      }
    }
    return Promise.reject(error);
  }
);
