import type { LucideIcon } from 'lucide-react';

import type { UserRole } from '@/typings/services/auth';

export type SubNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  roles: UserRole[];
};

export type ModuleItem = {
  id: number;
  label: string;
  icon: LucideIcon;
  /** Sub-items del módulo. Si está vacío, el botón es solo un placeholder. */
  subItems: SubNavItem[];
  /** URL base para detectar si el módulo está activo */
  basePaths?: string[];
};

export type ModuleButtonProps = {
  mod: ModuleItem;
  pathname: string;
  role: UserRole | undefined;
  onNavigate: () => void;
};
