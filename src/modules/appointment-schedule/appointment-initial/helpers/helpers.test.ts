import { addDays, isSameDay } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { getCalendarDays, getRangeTimeAvailability } from './helpers';

describe('getCalendarDays', () => {
  it('should return an array of 31 dates', () => {
    const days = getCalendarDays();
    expect(days).toHaveLength(31);
  });

  it('should start with today', () => {
    const days = getCalendarDays();
    expect(isSameDay(days[0], new Date())).toBe(true);
  });

  it('should end 30 days from today', () => {
    const days = getCalendarDays();
    const expected = addDays(new Date(), 30);
    expect(isSameDay(days[30], expected)).toBe(true);
  });

  it('should return consecutive days', () => {
    const days = getCalendarDays();

    for (let i = 1; i < days.length; i++) {
      expect(isSameDay(days[i], addDays(days[0], i))).toBe(true);
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
  const date = new Date(2026, 4, 16); // 2026-05-16

  it('should return 18 slots from 9:00 to 18:00', () => {
    const slots = getRangeTimeAvailability(date);
    expect(slots).toHaveLength(18);
  });

  it('should start at 09:00 - 09:30', () => {
    const slots = getRangeTimeAvailability(date);
    expect(slots[0].label).toBe('09:00 - 09:30');
  });

  it('should end at 17:30 - 18:00', () => {
    const slots = getRangeTimeAvailability(date);
    expect(slots[slots.length - 1].label).toBe('17:30 - 18:00');
  });

  it('should have value in yyyy-MM-dd HH:mm:ss format', () => {
    const slots = getRangeTimeAvailability(date);
    expect(slots[0].value).toBe('2026-05-16 09:00:00');
    expect(slots[1].value).toBe('2026-05-16 09:30:00');
  });

  it('should exclude occupied slots', () => {
    const occupied = ['2026-05-16 09:00:00', '2026-05-16 15:30:00'];
    const slots = getRangeTimeAvailability(date, occupied);

    expect(slots).toHaveLength(16);
    expect(slots.find(s => s.value === occupied[0])).toBeUndefined();
    expect(slots.find(s => s.value === occupied[1])).toBeUndefined();
  });

  it('should return all slots when no occupied slots are provided', () => {
    const slots = getRangeTimeAvailability(date, []);
    expect(slots).toHaveLength(18);
  });
});