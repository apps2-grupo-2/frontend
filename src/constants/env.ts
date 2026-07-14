export const ENV = {
  // Backend propio (modulo 2 - turnos): turnos, especialidades, centros medicos, notificaciones.
  // Entrega final -> prod (app.). Alternativas: dev.solefrancisco.com / test.solefrancisco.com.
  BASE_URL: 'https://app.solefrancisco.com/apps2/api/v1',
  // Backend del grupo Core (modulo 10): autenticacion y gestion de usuarios.
  // Login por email + contrasena -> { token, user }. Server de produccion segun swagger del core.
  // (daii.nicopenaloza.com es el de dev/staging si hace falta alternar.)
  CORE_BASE_URL: 'https://api.healthcare.cantero.ar',
  MOCK_BASE_URL: 'http://localhost:3000',
  // API key exigida por el core para pegarle al backend propio (turnos).
  // Sin este header, el back rechaza la peticion. Se manda en TODAS las
  // requests a BASE_URL via el interceptor de src/lib/api-key.ts.
  API_KEY: 'appointments-secret-key',
  // Activar para trabajar con todo mockeado en memoria (sin backend).
  // Poner en false para consumir los backends reales (propio + core).
  // En runtime se puede alternar desde el switch del login (useMockStore).
  // Entrega final: arranca en REAL; el switch del login permite ir a mock.
  USE_MOCKS: false,
} as const;