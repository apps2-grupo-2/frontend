import { describe, expect, it } from 'vitest';

import { getUserInitials } from './helpers';

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