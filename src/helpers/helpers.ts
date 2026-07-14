import { format } from 'date-fns/format';

import { parseApiDate } from '@/helpers/dates';

export const getUserInitials = (name: string | null | undefined): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('');
};
export const formatDateTime = (dateTime: string) => {
  const date = parseApiDate(dateTime);
  return format(date, 'dd/MM/yyyy HH:mm:ss');
};