import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  BedDouble,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  FlaskConical,
  LogOut,
  Menu,
  Monitor,
  Pill,
  Receipt,
  ScanLine,
  Settings,
  UserRound,
  X,
} from 'lucide-react';

import type { ModuleButtonProps, ModuleItem } from '@/typings/components/layouts/sidebar';
import { ROUTES, USER_TYPE } from '@/constants';
import { useGetModules } from '@/hooks/use-others-data';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

const MODULES: ModuleItem[] = [
  {
    id: 1,
    label: 'Historia Clínica',
    icon: FileText,
    subItems: [],
  },
  {
    id: 2,
    label: 'Turnos y Agendas',
    icon: Calendar,
    basePaths: [ROUTES.TURNOS, ROUTES.SOLICITAR_TURNOS, ROUTES.AGENDA_PROFESIONAL, ROUTES.PRESENTISMO],
    subItems: [
      {
        href: ROUTES.TURNOS,
        label: 'Mis turnos',
        icon: Calendar,
        description: 'Ver y solicitar turnos',
        roles: [USER_TYPE.PATIENT],
      },
      {
        href: ROUTES.AGENDA_PROFESIONAL,
        label: 'Mi agenda',
        icon: CalendarDays,
        description: 'Tu disponibilidad semanal',
        roles: [USER_TYPE.PROFESSIONAL],
      },
      {
        href: ROUTES.AGENDA_PROFESIONAL,
        label: 'Agenda profesional',
        icon: CalendarDays,
        description: 'Disponibilidad por médico',
        roles: [USER_TYPE.ADMINISTRATIVE],
      },
      {
        href: ROUTES.PRESENTISMO,
        label: 'Presentismo',
        icon: ClipboardList,
        description: 'Registro de llegada',
        roles: [USER_TYPE.ADMINISTRATIVE],
      },
    ],
  },
  {
    id: 3,
    label: 'Farmacia e Insumos',
    icon: Pill,
    subItems: [],
  },
  {
    id: 4,
    label: 'Laboratorio',
    icon: FlaskConical,
    subItems: [],
  },
  {
    id: 5,
    label: 'Diagnóstico por Imágenes',
    icon: ScanLine,
    subItems: [],
  },
  {
    id: 6,
    label: 'Internación y Camas',
    icon: BedDouble,
    subItems: [],
  },
  {
    id: 7,
    label: 'Facturación',
    icon: Receipt,
    subItems: [],
  },
  {
    id: 8,
    label: 'Portal del Paciente',
    icon: UserRound,
    subItems: [],
  },
  {
    id: 9,
    label: 'Monitoreo',
    icon: Monitor,
    subItems: [],
  },
  {
    id: 10,
    label: 'Core',
    icon: Settings,
    subItems: [],
  },
];

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 h-screen flex-col shrink-0 border-r border-sidebar-border bg-sidebar lg:flex">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-sidebar-foreground">Health Grid</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-sidebar-foreground transition-all duration-150 hover:bg-sidebar-accent/60 active:scale-95"
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 animate-in bg-foreground/40 backdrop-blur-sm duration-200 fill-mode-both fade-in" />
          <aside
            className="absolute top-0 left-0 h-full w-64 animate-in overflow-y-auto bg-sidebar duration-200 fill-mode-both slide-in-from-left sm:w-72"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex h-full flex-col pt-16">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

const SidebarContent = ({ onNavigate }: { onNavigate: () => void }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { role, name, subtitle, resetStore } = useAuthStore();
  const { data: modules } = useGetModules();

  console.warn('modules list');
  console.warn(modules);

  const handleLogout = () => {
    resetStore();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const userInitials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
    : '?';

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-sidebar-border px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-heading text-lg leading-none font-bold text-sidebar-foreground">Health Grid</span>
            <p className="mt-0.5 text-xs text-sidebar-foreground/60">Sistema hospitalario</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-2 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">{name ?? '—'}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{subtitle ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Modules nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Módulos">
        <p className="mb-2 px-3 text-[10px] font-semibold tracking-wider text-sidebar-foreground/40 uppercase">
          Módulos
        </p>
        <div className="space-y-0.5">
          {MODULES.map(mod => (
            <ModuleButton key={mod.id} mod={mod} pathname={pathname} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-4 text-sidebar-foreground/60 transition-all duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

const ModuleButton = (props: ModuleButtonProps) => {
  const { mod, pathname } = props;
  const isActiveModule = mod.basePaths?.some(p => pathname.startsWith(p)) ?? false;

  return (
    <div
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-all duration-150 active:scale-[0.98]',
        isActiveModule
          ? 'bg-sidebar-accent font-medium text-sidebar-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent'
      )}
    >
      <mod.icon className="h-4 w-4 shrink-0 text-sidebar-foreground" />
      <span className="text-sm text-sidebar-foreground">{mod.label}</span>
    </div>
  );
};