import { addDays, isWeekend } from 'date-fns';
import { describe, expect, it } from 'vitest';

import type { Appointment } from '@/typings/services';
import { APPOINTMENT_STATUSES } from '@/constants';
import { getCalendarDays, getRangeTimeAvailability } from './helpers';

describe('getCalendarDays', () => {
  it('should return only weekdays (Monday to Friday)', () => {
    const days = getCalendarDays();
    for (const day of days) {
      expect(isWeekend(day)).toBe(false);
    }
  });

  it('should return dates within the next 31 days', () => {
    const days = getCalendarDays();
    const today = new Date();
    const limit = addDays(today, 32);

    for (const day of days) {
      expect(day.getTime()).toBeGreaterThan(today.getTime());
      expect(day.getTime()).toBeLessThan(limit.getTime());
    }
  });

  it('should return between 22 and 23 weekdays', () => {
    const days = getCalendarDays();
    expect(days.length).toBeGreaterThanOrEqual(22);
    expect(days.length).toBeLessThanOrEqual(23);
  });

  it('should return dates in ascending order', () => {
    const days = getCalendarDays();
    for (let i = 1; i < days.length; i++) {
      expect(days[i].getTime()).toBeGreaterThan(days[i - 1].getTime());
    }
  });

  it('should return Date instances', () => {
    const days = getCalendarDays();
    for (const day of days) {
      expect(day).toBeInstanceOf(Date);
    }
  });
});

describe('getRangeTimeAvailability', () => {
  const date = '2026-05-16';

  const makeAppointment = (starts_at: string): Appointment => ({
    id: 51,
    status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
    starts_at,
    ends_at: '2026-05-18 16:00:00',
    confirmed_at: null,
    absent_at: null,
    expired_at: null,
    checked_in_at: null,
    cancelled_at: null,
    completed_at: null,
    started_at: null,
    created_at: '2026-05-17 16:41:59',
    patient: {
      id: 2,
      fullname: 'Camila Díaz',
      email: 'camila.diaz@mock.com',
    },
    medic: {
      id: 1,
      fullname: 'Nicolás Torres',
      email: 'nicolas.torres@mock.com',
    },
    speciality: {
      id: 1,
      name: 'test',
      is_high_complexity: 1,
    },
    medical_center: {
      id: 1,
      name: 'Test Center',
    },
  });

  it('should return 18 slots from 9:00 to 18:00', () => {
    const slots = getRangeTimeAvailability([], date);
    expect(slots).toHaveLength(18);
  });

  it('should start at 09:00 - 09:30', () => {
    const slots = getRangeTimeAvailability([], date);
    expect(slots[0].label).toBe('09:00 - 09:30');
  });

  it('should end at 17:30 - 18:00', () => {
    const slots = getRangeTimeAvailability([], date);
    expect(slots[slots.length - 1].label).toBe('17:30 - 18:00');
  });

  it('should have value in yyyy-MM-dd HH:mm:ss format', () => {
    const slots = getRangeTimeAvailability([], date);
    expect(slots[0].value).toBe('2026-05-16 09:00:00');
    expect(slots[1].value).toBe('2026-05-16 09:30:00');
  });

  it('should exclude occupied slots', () => {
    const appointments = [makeAppointment('2026-05-16 09:00:00'), makeAppointment('2026-05-16 15:30:00')];
    const slots = getRangeTimeAvailability(appointments, date);

    expect(slots).toHaveLength(16);
    expect(slots.find(s => s.value === '2026-05-16 09:00:00')).toBeUndefined();
    expect(slots.find(s => s.value === '2026-05-16 15:30:00')).toBeUndefined();
  });

  it('should return all slots when no appointments match', () => {
    const slots = getRangeTimeAvailability([], date);
    expect(slots).toHaveLength(18);
  });

  describe('with realistic endpoint data', () => {
    const realAppointments: Appointment[] = [
      {
        id: 51,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-18 15:30:00',
        ends_at: '2026-05-18 16:00:00',
        confirmed_at: null,
        absent_at: null,
        expired_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
        started_at: null,
        created_at: '2026-05-17 16:41:59',
        patient: {
          id: 2,
          fullname: 'Diego Sánchez',
          email: 'diego.sanchez@mock.com',
        },
        medic: {
          id: 1,
          fullname: 'Emma Ortiz',
          email: 'emma.ortiz@mock.com',
        },
        speciality: {
          id: 1,
          name: 'test',
          is_high_complexity: 1,
        },
        medical_center: {
          id: 1,
          name: 'Test Center',
        },
      },
      {
        id: 48,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-18 17:30:00',
        ends_at: '2026-05-18 18:00:00',
        confirmed_at: null,
        absent_at: null,
        expired_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
        started_at: null,
        created_at: '2026-05-17 16:36:19',
        patient: {
          id: 2,
          fullname: 'Federico Herrera',
          email: 'federico.herrera@mock.com',
        },
        medic: {
          id: 1,
          fullname: 'Lucía Fernández',
          email: 'lucia.fernandez@mock.com',
        },
        speciality: {
          id: 1,
          name: 'test',
          is_high_complexity: 1,
        },
        medical_center: {
          id: 1,
          name: 'Test Center',
        },
      },
      {
        id: 53,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-19 12:30:00',
        ends_at: '2026-05-19 13:00:00',
        confirmed_at: null,
        absent_at: null,
        expired_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
        started_at: null,
        created_at: '2026-05-17 16:43:01',
        patient: {
          id: 2,
          fullname: 'Sofía Martínez',
          email: 'sofia.martinez@mock.com',
        },
        medic: {
          id: 1,
          fullname: 'Camila Díaz',
          email: 'camila.diaz@mock.com',
        },
        speciality: {
          id: 1,
          name: 'test',
          is_high_complexity: 1,
        },
        medical_center: {
          id: 1,
          name: 'Test Center',
        },
      },
      {
        id: 22,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-19 17:00:00',
        ends_at: '2026-05-19 17:30:00',
        confirmed_at: null,
        absent_at: null,
        expired_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
        started_at: null,
        created_at: '2026-05-17 16:03:03',
        patient: {
          id: 2,
          fullname: 'Lucía Fernández',
          email: 'lucia.fernandez@mock.com',
        },
        medic: {
          id: 1,
          fullname: 'Juan Pérez',
          email: 'juan.perez@mock.com',
        },
        speciality: {
          id: 1,
          name: 'test',
          is_high_complexity: 1,
        },
        medical_center: {
          id: 1,
          name: 'Test Center',
        },
      },
      {
        id: 47,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-19 17:30:00',
        ends_at: '2026-05-19 18:00:00',
        confirmed_at: null,
        absent_at: null,
        expired_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
        started_at: null,
        created_at: '2026-05-17 16:34:05',
        patient: {
          id: 2,
          fullname: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@mock.com',
        },
        medic: {
          id: 1,
          fullname: 'Agustina Medina',
          email: 'agustina.medina@mock.com',
        },
        speciality: {
          id: 1,
          name: 'test',
          is_high_complexity: 1,
        },
        medical_center: {
          id: 1,
          name: 'Test Center',
        },
      },
      {
        id: 54,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-20 12:30:00',
        ends_at: '2026-05-20 13:00:00',
        confirmed_at: null,
        absent_at: null,
        expired_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
        started_at: null,
        created_at: '2026-05-17 16:43:34',
        patient: {
          id: 2,
          fullname: 'Mateo Silva',
          email: 'mateo.silva@mock.com',
        },
        medic: {
          id: 1,
          fullname: 'Benjamín Ruiz',
          email: 'benjamin.ruiz@mock.com',
        },
        speciality: {
          id: 1,
          name: 'test',
          is_high_complexity: 1,
        },
        medical_center: {
          id: 1,
          name: 'Test Center',
        },
      },
      {
        id: 63,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-20 15:00:00',
        ends_at: '2026-05-20 15:30:00',
        confirmed_at: null,
        absent_at: null,
        expired_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
        started_at: null,
        created_at: '2026-05-17 16:57:49',
        patient: {
          id: 1,
          fullname: 'Benjamín Ruiz',
          email: 'benjamin.ruiz@mock.com',
        },
        medic: {
          id: 1210,
          fullname: 'Camila Díaz',
          email: 'camila.diaz@mock.com',
        },
        speciality: {
          id: 1,
          name: 'test',
          is_high_complexity: 1,
        },
        medical_center: {
          id: 1,
          name: 'Test Center',
        },
      },
      {
        id: 68,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-20 16:00:00',
        ends_at: '2026-05-20 16:30:00',
        confirmed_at: null,
        absent_at: null,
        expired_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
        started_at: null,
        created_at: '2026-05-17 16:59:57',
        patient: {
          id: 1,
          fullname: 'Florencia Ríos',
          email: 'florencia.rios@mock.com',
        },
        medic: {
          id: 1210,
          fullname: 'Martín López',
          email: 'martin.lopez@mock.com',
        },
        speciality: {
          id: 1,
          name: 'test',
          is_high_complexity: 1,
        },
        medical_center: {
          id: 1,
          name: 'Test Center',
        },
      },
      {
        id: 23,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-20 17:00:00',
        ends_at: '2026-05-20 17:30:00',
        confirmed_at: null,
        absent_at: null,
        expired_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
        started_at: null,
        created_at: '2026-05-17 16:04:08',
        patient: {
          id: 2,
          fullname: 'María González',
          email: 'maria.gonzalez@mock.com',
        },
        medic: {
          id: 1,
          fullname: 'Florencia Ríos',
          email: 'florencia.rios@mock.com',
        },
        speciality: {
          id: 1,
          name: 'test',
          is_high_complexity: 1,
        },
        medical_center: {
          id: 1,
          name: 'Test Center',
        },
      },
      {
        id: 46,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-20 17:30:00',
        ends_at: '2026-05-20 18:00:00',
        confirmed_at: null,
        absent_at: null,
        expired_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
        started_at: null,
        created_at: '2026-05-17 16:33:16',
        patient: {
          id: 2,
          fullname: 'Julieta Castro',
          email: 'julieta.castro@mock.com',
        },
        medic: {
          id: 1,
          fullname: 'Martín López',
          email: 'martin.lopez@mock.com',
        },
        speciality: {
          id: 1,
          name: 'test',
          is_high_complexity: 1,
        },
        medical_center: {
          id: 1,
          name: 'Test Center',
        },
      },
      {
        id: 55,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-21 12:30:00',
        ends_at: '2026-05-21 13:00:00',
        confirmed_at: null,
        absent_at: null,
        expired_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
        started_at: null,
        created_at: '2026-05-17 16:46:19',
        patient: {
          id: 2,
          fullname: 'Lucía Fernández',
          email: 'lucia.fernandez@mock.com',
        },
        medic: {
          id: 1,
          fullname: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@mock.com',
        },
        speciality: {
          id: 1,
          name: 'test',
          is_high_complexity: 1,
        },
        medical_center: {
          id: 1,
          name: 'Test Center',
        },
      },
    ];

    it('should exclude 2 slots on 2026-05-18', () => {
      const slots = getRangeTimeAvailability(realAppointments, '2026-05-18');
      expect(slots).toHaveLength(16);
      expect(slots.find(s => s.value === '2026-05-18 15:30:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-18 17:30:00')).toBeUndefined();
    });

    it('should exclude 3 slots on 2026-05-19', () => {
      const slots = getRangeTimeAvailability(realAppointments, '2026-05-19');
      expect(slots).toHaveLength(15);
      expect(slots.find(s => s.value === '2026-05-19 12:30:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-19 17:00:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-19 17:30:00')).toBeUndefined();
    });

    it('should exclude all appointments on 2026-05-20 regardless of medic', () => {
      const slots = getRangeTimeAvailability(realAppointments, '2026-05-20');

      // 5 appointments on 2026-05-20: 12:30, 15:00, 16:00, 17:00, 17:30
      expect(slots).toHaveLength(13);
      expect(slots.find(s => s.value === '2026-05-20 12:30:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-20 15:00:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-20 16:00:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-20 17:00:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-20 17:30:00')).toBeUndefined();
    });

    it('should not exclude slots from other dates', () => {
      const slots = getRangeTimeAvailability(realAppointments, '2026-05-21');
      // 1 appointment on 2026-05-21 (id: 55 at 12:30)
      expect(slots).toHaveLength(17);
      expect(slots.find(s => s.value === '2026-05-21 12:30:00')).toBeUndefined();
    });

    it('should return all slots for a date with no appointments', () => {
      const slots = getRangeTimeAvailability(realAppointments, '2026-05-22');
      expect(slots).toHaveLength(18);
    });

    it('should exclude slots when date includes time component', () => {
      const slots = getRangeTimeAvailability(realAppointments, '2026-05-18 00:00:00');
      expect(slots).toHaveLength(16);
      expect(slots.find(s => s.value === '2026-05-18 15:30:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-18 17:30:00')).toBeUndefined();
    });
  });
});