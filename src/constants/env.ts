export const ENV = {
  // Backend propio (modulo 2 - turnos): turnos, especialidades, centros medicos, notificaciones.
  BASE_URL: 'https://dev.solefrancisco.com/apps2/api/v1',
  // Backend del grupo Core (modulo 10): autenticacion y gestion de usuarios.
  // Login por email + contrasena -> { token, user }. Ver doc del core (SwaggerHub uade-0e3/core).
  CORE_BASE_URL: 'https://daii.nicopenaloza.com',
  MOCK_BASE_URL: 'http://localhost:3000',
  // Activar para trabajar con todo mockeado en memoria (sin backend).
  // Poner en false para consumir los backends reales (propio + core).
  // En runtime se puede alternar desde el switch del login (useMockStore).
  USE_MOCKS: true,
} as const;
