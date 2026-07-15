export const ENV = {
  // Backend propio (modulo 2 - turnos): turnos, especialidades, centros medicos, notificaciones.
  // Entrega final -> prod (app.). Alternativas: dev.solefrancisco.com / test.solefrancisco.com.
  BASE_URL: 'https://dev.solefrancisco.com/apps2/api/v1',
  // Backend del grupo Core (modulo 10): autenticacion y gestion de usuarios.
  // Login por email + contrasena -> { token, user }. Server de produccion segun swagger del core.
  CORE_BASE_URL: 'https://api.healthcare.cantero.ar',
  // API key exigida por el core para pegarle al backend propio (turnos).
  // Sin este header, el back rechaza la peticion. Se manda en TODAS las
  // requests a BASE_URL via el interceptor de src/lib/api-key.ts.
  API_KEY: 'appointments-secret-key',
} as const;

// Ubicación por defecto (Obelisco, CABA) para cuando el navegador no da permiso
// de geolocalización. Se usa sólo para ordenar centros médicos por cercanía.
export const DEFAULT_GEO = { lat: '-34.603722', lng: '-58.381592' } as const;