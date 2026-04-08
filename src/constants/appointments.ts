export enum APPOINTMENTS_STEPS {
  APPOINTMENT_INITIAL,
  APPOINTMENT_CALENDAR,
}

export const APPOINTMENT_TYPES = {
  SPECIALTY: 'specialty',
  PROFESSIONAL: 'professional',
} as const;

export const PRIORITY_TYPES = {
  PROXIMITY: 'proximity',
  AVAILABILITY: 'availability',
} as const;
