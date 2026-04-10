import type { OptionsResponse, ProfessionalsResponse } from '@/typings/services/appointments';

// Slots disponibles por fecha (key: 'YYYY-MM-DD')
// TODO: reemplazar con GET /appointments/availability?date=YYYY-MM-DD&professionalId=X&centerId=Y
export const MOCK_TIME_SLOTS_BY_DATE: Record<string, string[]> = {
  '2026-04-07': ['09:00', '09:30', '10:30', '11:00', '14:00', '14:30', '15:30'],
  '2026-04-10': ['09:00', '10:00', '10:30', '14:30', '15:00', '16:00'],
  '2026-04-15': ['09:30', '10:00', '11:00', '11:30', '14:00', '14:30'],
  '2026-04-22': ['09:00', '09:30', '10:00', '10:30', '15:00', '15:30', '16:00'],
};

export const MOCK_ENABLED_DATES = Object.keys(MOCK_TIME_SLOTS_BY_DATE).map(d => new Date(d + 'T00:00:00'));

export const MOCK_PROFESSIONALS: ProfessionalsResponse = [
  { value: '1', label: 'Fernandez Juan Pablo', specialties: ['328', '307'] },
  { value: '2', label: 'Peralta Carlos Alberto', specialties: ['185'] },
  { value: '3', label: 'Rodríguez Martín Eduardo', specialties: ['229', '267'] },
  { value: '4', label: 'Vásquez Laura Beatriz', specialties: ['201', '225'] },
  { value: '5', label: 'Morales Ana María', specialties: ['191'] },
  { value: '7', label: 'García Silvia Alejandra', specialties: ['193', '284'] },
  { value: '9', label: 'Sánchez Patricia Noemí', specialties: ['226', '263'] },
  { value: '13', label: 'Díaz Marcela Soledad', specialties: ['176', '236'] },
];

export const MOCK_SPECIALTIES: OptionsResponse = [
  { value: '176', label: 'Alergia' },
  { value: '328', label: 'Cardiologia' },
  { value: '307', label: 'Electrofisiologia' },
  { value: '185', label: 'Cirugia general' },
  { value: '191', label: 'Dermatologia' },
  { value: '193', label: 'Endocrinologia' },
  { value: '284', label: 'Diabetologia' },
  { value: '197', label: 'Gastroenterologia' },
  { value: '201', label: 'Ginecologia' },
  { value: '225', label: 'Obstetricia' },
  { value: '226', label: 'Oftalmologia' },
  { value: '263', label: 'Oftalmologia pediatrico' },
  { value: '222', label: 'Neurologia' },
  { value: '219', label: 'Neumonologia' },
  { value: '229', label: 'Ortopedia y traumatologia' },
  { value: '267', label: 'Ortopedia y traumatologia pediatrica' },
  { value: '232', label: 'Psiquiatria' },
  { value: '313', label: 'Psicologia' },
  { value: '242', label: 'Urologia' },
  { value: '236', label: 'Reumatologia' },
];

export const MOCK_MEDICAL_CENTERS: OptionsResponse = [
  { value: '1', label: 'Hospital Central' },
  { value: '2', label: 'Clínica San José' },
  { value: '4', label: 'Hospital General' },
  { value: '7', label: 'Hospital Regional' },
  { value: '9', label: 'Centro Médico El Buen Samaritano' },
];

export const MOCK_MEDICAL_CENTERS_AVAILABILITY: OptionsResponse = [
  { value: '3', label: 'Centro Médico Santa María' },
  { value: '5', label: 'Clínica del Sol' },
  { value: '6', label: 'Centro de Salud La Esperanza' },
  { value: '8', label: 'Clínica Vida Sana' },
  { value: '10', label: 'Hospital de la Ciudad' },
];
