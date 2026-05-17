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
  const medicId = '1';

  const makeAppointment = (starts_at: string): Appointment => ({
    id: 51,
    center_id: 1,
    status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
    starts_at,
    ends_at: '2026-05-18 16:00:00',
    confirmed_at: null,
    checked_in_at: null,
    cancelled_at: null,
    completed_at: null,
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
  });

  it('should return 18 slots from 9:00 to 18:00', () => {
    const slots = getRangeTimeAvailability([], date, medicId);
    expect(slots).toHaveLength(18);
  });

  it('should start at 09:00 - 09:30', () => {
    const slots = getRangeTimeAvailability([], date, medicId);
    expect(slots[0].label).toBe('09:00 - 09:30');
  });

  it('should end at 17:30 - 18:00', () => {
    const slots = getRangeTimeAvailability([], date, medicId);
    expect(slots[slots.length - 1].label).toBe('17:30 - 18:00');
  });

  it('should have value in yyyy-MM-dd HH:mm:ss format', () => {
    const slots = getRangeTimeAvailability([], date, medicId);
    expect(slots[0].value).toBe('2026-05-16 09:00:00');
    expect(slots[1].value).toBe('2026-05-16 09:30:00');
  });

  it('should exclude occupied slots', () => {
    const appointments = [makeAppointment('2026-05-16 09:00:00'), makeAppointment('2026-05-16 15:30:00')];
    const slots = getRangeTimeAvailability(appointments, date, medicId);

    expect(slots).toHaveLength(16);
    expect(slots.find(s => s.value === '2026-05-16 09:00:00')).toBeUndefined();
    expect(slots.find(s => s.value === '2026-05-16 15:30:00')).toBeUndefined();
  });

  it('should return all slots when no appointments match', () => {
    const slots = getRangeTimeAvailability([], date, medicId);
    expect(slots).toHaveLength(18);
  });

  describe('with realistic endpoint data', () => {
    const realAppointments: Appointment[] = [
      {
        id: 51,
        center_id: 1,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-18 15:30:00',
        ends_at: '2026-05-18 16:00:00',
        confirmed_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
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
      },
      {
        id: 48,
        center_id: 1,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-18 17:30:00',
        ends_at: '2026-05-18 18:00:00',
        confirmed_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
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
      },
      {
        id: 53,
        center_id: 1,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-19 12:30:00',
        ends_at: '2026-05-19 13:00:00',
        confirmed_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
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
      },
      {
        id: 22,
        center_id: 1,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-19 17:00:00',
        ends_at: '2026-05-19 17:30:00',
        confirmed_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
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
      },
      {
        id: 47,
        center_id: 1,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-19 17:30:00',
        ends_at: '2026-05-19 18:00:00',
        confirmed_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
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
      },
      {
        id: 54,
        center_id: 1,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-20 12:30:00',
        ends_at: '2026-05-20 13:00:00',
        confirmed_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
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
      },
      {
        id: 63,
        center_id: 1,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-20 15:00:00',
        ends_at: '2026-05-20 15:30:00',
        confirmed_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
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
      },
      {
        id: 68,
        center_id: 1,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-20 16:00:00',
        ends_at: '2026-05-20 16:30:00',
        confirmed_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
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
      },
      {
        id: 23,
        center_id: 1,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-20 17:00:00',
        ends_at: '2026-05-20 17:30:00',
        confirmed_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
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
      },
      {
        id: 46,
        center_id: 1,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-20 17:30:00',
        ends_at: '2026-05-20 18:00:00',
        confirmed_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
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
      },
      {
        id: 55,
        center_id: 1,
        status: 'PENDING_CONFIRMATION',
        starts_at: '2026-05-21 12:30:00',
        ends_at: '2026-05-21 13:00:00',
        confirmed_at: null,
        checked_in_at: null,
        cancelled_at: null,
        completed_at: null,
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
      },
    ];

    it('should exclude 2 slots for medic 1 on 2026-05-18', () => {
      const slots = getRangeTimeAvailability(realAppointments, '2026-05-18', '1');
      expect(slots).toHaveLength(16);
      expect(slots.find(s => s.value === '2026-05-18 15:30:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-18 17:30:00')).toBeUndefined();
    });

    it('should exclude 3 slots for medic 1 on 2026-05-19', () => {
      const slots = getRangeTimeAvailability(realAppointments, '2026-05-19', '1');
      expect(slots).toHaveLength(15);
      expect(slots.find(s => s.value === '2026-05-19 12:30:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-19 17:00:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-19 17:30:00')).toBeUndefined();
    });

    it('should only exclude slots for the requested medic_id', () => {
      const slotsForMedic1 = getRangeTimeAvailability(realAppointments, '2026-05-20', '1');
      const slotsForMedic1210 = getRangeTimeAvailability(realAppointments, '2026-05-20', '1210');

      // medic 1 has 3 appointments on 2026-05-20
      expect(slotsForMedic1).toHaveLength(15);
      expect(slotsForMedic1.find(s => s.value === '2026-05-20 12:30:00')).toBeUndefined();
      expect(slotsForMedic1.find(s => s.value === '2026-05-20 17:00:00')).toBeUndefined();
      expect(slotsForMedic1.find(s => s.value === '2026-05-20 17:30:00')).toBeUndefined();

      // medic 1210 has 2 appointments on 2026-05-20
      expect(slotsForMedic1210).toHaveLength(16);
      expect(slotsForMedic1210.find(s => s.value === '2026-05-20 15:00:00')).toBeUndefined();
      expect(slotsForMedic1210.find(s => s.value === '2026-05-20 16:00:00')).toBeUndefined();
    });

    it('should not exclude slots from other dates', () => {
      const slots = getRangeTimeAvailability(realAppointments, '2026-05-21', '1');
      // medic 1 has 1 appointment on 2026-05-21 (id: 55 at 12:30)
      expect(slots).toHaveLength(17);
      expect(slots.find(s => s.value === '2026-05-21 12:30:00')).toBeUndefined();
    });

    it('should return all slots for a medic with no appointments on that date', () => {
      const slots = getRangeTimeAvailability(realAppointments, '2026-05-18', '1210');
      expect(slots).toHaveLength(18);
    });

    it('should exclude slots when date includes time component', () => {
      const slots = getRangeTimeAvailability(realAppointments, '2026-05-18 00:00:00', '1');
      expect(slots).toHaveLength(16);
      expect(slots.find(s => s.value === '2026-05-18 15:30:00')).toBeUndefined();
      expect(slots.find(s => s.value === '2026-05-18 17:30:00')).toBeUndefined();
    });
  });
});