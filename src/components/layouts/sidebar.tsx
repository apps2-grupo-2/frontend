import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, CalendarDays, ChevronRight, Menu, X, Activity, LogOut, ClipboardList } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants';
import type { UserRole } from '@/typings/services/auth';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  paciente: [
    { href: ROUTES.TURNOS, label: 'Mis turnos', icon: Calendar, description: 'Ver y solicitar turnos' },
  ],
  profesional: [
    { href: ROUTES.AGENDA_PROFESIONAL, label: 'Mi agenda', icon: CalendarDays, description: 'Tu disponibilidad semanal' },
  ],
  administrativo: [
    { href: ROUTES.AGENDA_PROFESIONAL, label: 'Agenda profesional', icon: CalendarDays, description: 'Disponibilidad por médico' },
    { href: ROUTES.PRESENTISMO, label: 'Presentismo', icon: ClipboardList, description: 'Registro de llegada' },
  ],
};

const PORTAL_LABEL: Record<UserRole, string> = {
  paciente: 'Portal del Paciente',
  profesional: 'Portal del Profesional',
  administrativo: 'Portal Administrativo',
};

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden min-h-screen w-64 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
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
          className="p-1 text-sidebar-foreground"
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="animate-in fade-in fill-mode-both duration-200 absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <aside
            className="animate-in slide-in-from-left fill-mode-both duration-200 absolute top-0 left-0 h-full w-64 overflow-y-auto bg-sidebar sm:w-72"
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

  const navItems = role ? (NAV_BY_ROLE[role] ?? []) : [];
  const portalLabel = role ? PORTAL_LABEL[role] : 'Health Grid';

  const handleLogout = () => {
    resetStore();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const userInitials = name
    ? name.split(' ').slice(0, 2).map(n => n[0]).join('')
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
            <p className="mt-0.5 text-xs text-sidebar-foreground/60">{portalLabel}</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-2 py-2.5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {name ?? '—'}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">{subtitle ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navegación principal">
        <div className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, description }) => {
            const isActive = pathname.startsWith(href);
            return (
              <NavLink
                key={href}
                to={href}
                onClick={onNavigate}
                className={() =>
                  cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-150',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-sidebar-foreground hover:translate-x-0.5 hover:bg-sidebar-accent'
                  )
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium">{label}</span>
                  <p
                    className={cn(
                      'truncate text-xs',
                      isActive ? 'text-primary-foreground/70' : 'text-sidebar-foreground/50'
                    )}
                  >
                    {description}
                  </p>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-4 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};
