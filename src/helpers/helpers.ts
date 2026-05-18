export const getUserInitials = (name: string | null | undefined): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('');
};