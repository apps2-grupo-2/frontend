import type { LucideIcon } from 'lucide-react';

import type { UserRole } from '@/typings/services/auth';

export type SubNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  roles: UserRole[];
};

export type Module = {
  id: string;
  label: string;
  icon: LucideIcon;
  url: string;
};

export type ModuleButtonProps = {
  mod: Module;
};