import { describe, expect, it } from 'vitest';

import { formatDate, getUserInitials } from './helpers';

describe('getUserInitials', () => {
  it('should return initials from first two words', () => {
    expect(getUserInitials('Juan Pérez')).toBe('JP');
  });

  it('should return single initial for one-word name', () => {
    expect(getUserInitials('Admin')).toBe('A');
  });

  it('should only take the first two words', () => {
    expect(getUserInitials('María José García López')).toBe('MJ');
  });

  it('should return "?" for null', () => {
    expect(getUserInitials(null)).toBe('?');
  });

  it('should return "?" for undefined', () => {
    expect(getUserInitials(undefined)).toBe('?');
  });

  it('should return "?" for empty string', () => {
    expect(getUserInitials('')).toBe('?');
  });
});

describe('formatDate', () => {
  it('should format a date in es-AR locale with day, month, and year', () => {
    expect(formatDate('2026-05-16')).toBe('16 de mayo de 2026');
  });

  it('should format a date at the beginning of the year', () => {
    expect(formatDate('2026-01-01')).toBe('1 de enero de 2026');
  });

  it('should format a date in December', () => {
    expect(formatDate('2025-12-25')).toBe('25 de diciembre de 2025');
  });

  it('should handle single-digit day and month', () => {
    expect(formatDate('2026-03-05')).toBe('5 de marzo de 2026');
  });

  it('should handle leap year date', () => {
    expect(formatDate('2024-02-29')).toBe('29 de febrero de 2024');
  });
});