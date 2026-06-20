export const ENV = {
  BASE_URL: 'https://dev.solefrancisco.com/apps2/api/v1',
  MOCK_BASE_URL: 'http://localhost:3000',
  // Activar para trabajar con turnos/pacientes mockeados en memoria (sin backend).
  // Poner en false para volver a consumir el backend real.
  USE_MOCKS: true,
} as const;