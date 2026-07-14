import { parseISO } from 'date-fns';

/**
 * Parseo de fechas de la API de forma determinística y cross-browser.
 *
 * El backend y los formularios usan el formato "YYYY-MM-DD HH:mm:ss" (con
 * espacio), que NO es ISO 8601: `new Date("2026-06-29 09:00:00")` funciona en
 * Chrome/V8 pero puede devolver Invalid Date en Safari/WebKit. Normalizamos el
 * espacio a "T" y usamos el parser propio de date-fns (`parseISO`), que no
 * depende del parseo nativo del navegador. Acepta también fechas ya en ISO
 * (con o sin "T"/offset) y fechas solo-fecha ("YYYY-MM-DD").
 */
export const parseApiDate = (value: string): Date => parseISO(String(value).replace(' ', 'T'));
