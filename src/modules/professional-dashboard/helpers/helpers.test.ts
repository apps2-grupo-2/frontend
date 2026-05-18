import { describe, expect, it } from 'vitest';

import type { Appointment } from '@/typings/services';
import { getDayAppointments, getFormattedDate, getWeekdaysByOffset } from './helpers';

const mockAppointments: Appointment[] = [
  {
    id: 134,
    center_id: 4,
    status: 'PENDING_CONFIRMATION',
    starts_at: '2026-05-18 11:00:00',
    ends_at: '2026-05-18 11:30:00',
    confirmed_at: null,
    checked_in_at: null,
    cancelled_at: null,
    completed_at: null,
    created_at: '2026-05-17 19:53:19',
    patient: {
      id: 1,
      fullname: 'Mateo Silva',
      email: 'mateo.silva@mock.com',
    },
    medic: {
      id: 1129,
      fullname: 'María González',
      email: 'maria.gonzalez@mock.com',
    },
    speciality: {
      id: 43,
      name: 'Angiografía',
      is_high_complexity: 1,
    },
  },
  {
    id: 135,
    center_id: 4,
    status: 'PENDING_CONFIRMATION',
    starts_at: '2026-05-18 14:30:00',
    ends_at: '2026-05-18 15:00:00',
    confirmed_at: null,
    checked_in_at: null,
    cancelled_at: null,
    completed_at: null,
    created_at: '2026-05-17 19:55:19',
    patient: {
      id: 1,
      fullname: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@mock.com',
    },
    medic: {
      id: 1212,
      fullname: 'Federico Herrera',
      email: 'federico.herrera@mock.com',
    },
    speciality: {
      id: 43,
      name: 'Angiografía',
      is_high_complexity: 1,
    },
  },
  {
    id: 136,
    center_id: 4,
    status: 'PENDING_CONFIRMATION',
    starts_at: '2026-05-18 16:00:00',
    ends_at: '2026-05-18 16:30:00',
    confirmed_at: null,
    checked_in_at: null,
    cancelled_at: null,
    completed_at: null,
    created_at: '2026-05-17 20:01:39',
    patient: {
      id: 1,
      fullname: 'Florencia Ríos',
      email: 'florencia.rios@mock.com',
    },
    medic: {
      id: 1129,
      fullname: 'Juan Pérez',
      email: 'juan.perez@mock.com',
    },
    speciality: {
      id: 43,
      name: 'Angiografía',
      is_high_complexity: 1,
    },
  },
];

describe('getFormattedDate', () => {
  it('should format a date with day, month and year in es-AR locale', () => {
    const date = new Date('2026-05-18T00:00:00');
    const result = getFormattedDate(date);
    expect(result).toBe('18 mayo de 2026');
  });

  it('should format a date in January', () => {
    const date = new Date('2026-01-05T00:00:00');
    const result = getFormattedDate(date);
    expect(result).toBe('5 enero de 2026');
  });
});

describe('getWeekdaysByOffset', () => {
  it('should return 5 weekdays for the current week', () => {
    const days = getWeekdaysByOffset(0);
    expect(days).toHaveLength(5);
  });

  it('should not include weekends', () => {
    const days = getWeekdaysByOffset(0);
    const hasWeekend = days.some(d => d.getDay() === 0 || d.getDay() === 6);
    expect(hasWeekend).toBe(false);
  });

  it('should return days from the next week when offset is 1', () => {
    const currentWeekDays = getWeekdaysByOffset(0);
    const nextWeekDays = getWeekdaysByOffset(1);
    expect(nextWeekDays[0].getTime()).toBeGreaterThan(currentWeekDays[4].getTime());
  });
});

describe('getDayAppointments', () => {
  const date = new Date('2026-05-18T00:00:00');

  it('should return 18 slots (9:00 to 17:30 in 30min intervals)', () => {
    const slots = getDayAppointments([], date);
    expect(slots).toHaveLength(18);
  });

  it('should have incremental ids starting from 0', () => {
    const slots = getDayAppointments([], date);
    slots.forEach((slot, index) => {
      expect(slot.id).toBe(index);
    });
  });

  it('should mark all slots as available when no appointments exist', () => {
    const slots = getDayAppointments([], date);
    slots.forEach(slot => {
      expect(slot.status).toBe('available');
      expect(slot.patient).toEqual({ id: 0, fullname: '', dni: '' });
    });
  });

  it('should generate starts_at in yyyy-MM-dd HH:mm:ss format', () => {
    const slots = getDayAppointments([], date);
    expect(slots[0].starts_at).toBe('2026-05-18 09:00:00');
    expect(slots[1].starts_at).toBe('2026-05-18 09:30:00');
    expect(slots[17].starts_at).toBe('2026-05-18 17:30:00');
  });

  it('should match appointments by starts_at and use their data', () => {
    const slots = getDayAppointments(mockAppointments, date);

    const slot11 = slots.find(s => s.starts_at === '2026-05-18 11:00:00');
    expect(slot11).toBeDefined();
    expect(slot11!.status).toBe('PENDING_CONFIRMATION');
    expect(slot11!.patient.fullname).toBe('Mateo Silva');
    expect(slot11!.patient.id).toBe(1);
  });

  it('should match the 14:30 appointment correctly', () => {
    const slots = getDayAppointments(mockAppointments, date);

    const slot1430 = slots.find(s => s.starts_at === '2026-05-18 14:30:00');
    expect(slot1430).toBeDefined();
    expect(slot1430!.status).toBe('PENDING_CONFIRMATION');
    expect(slot1430!.patient.fullname).toBe('Carlos Rodríguez');
  });

  it('should match the 16:00 appointment correctly', () => {
    const slots = getDayAppointments(mockAppointments, date);

    const slot16 = slots.find(s => s.starts_at === '2026-05-18 16:00:00');
    expect(slot16).toBeDefined();
    expect(slot16!.status).toBe('PENDING_CONFIRMATION');
    expect(slot16!.patient.fullname).toBe('Florencia Ríos');
  });

  it('should keep non-matching slots as available', () => {
    const slots = getDayAppointments(mockAppointments, date);

    const slot09 = slots.find(s => s.starts_at === '2026-05-18 09:00:00');
    expect(slot09!.status).toBe('available');
    expect(slot09!.patient.fullname).toBe('');
  });

  it('should handle undefined appointments defaulting to empty array', () => {
    const slots = getDayAppointments(undefined, date);
    expect(slots).toHaveLength(18);
    slots.forEach(slot => {
      expect(slot.status).toBe('available');
    });
  });
});