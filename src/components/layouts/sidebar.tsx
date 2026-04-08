import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, ChevronRight, Menu, X, Activity, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { currentPatient } from '@/lib/mock-data';

const navItems = [
  {
    href: '/turnos',
    label: 'Turnos',
    icon: Calendar,
    description: 'Obtener turnos',
  },
];

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden min-h-screen w-64 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <SidebarContent />
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
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <aside
            className="absolute top-0 left-0 h-full w-64 overflow-y-auto bg-sidebar sm:w-72"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex h-full flex-col pt-16">
              <SidebarContent />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

const SidebarContent = () => {
  const { pathname } = useLocation();
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
            <p className="mt-0.5 text-xs text-sidebar-foreground/60">Portal del Paciente</p>
          </div>
        </div>
      </div>

      {/* Patient info */}
      <div className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-2 py-2.5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {currentPatient.name
              .split(' ')
              .map(n => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {currentPatient.name.split(' ').slice(0, 2).join(' ')}
            </p>
            <p className="text-xs text-sidebar-foreground/60">{currentPatient.obraSocial}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Navegación principal">
        {navItems.map(({ href, label, icon: Icon, description }) => {
          const isActive = pathname.startsWith(href);
          return (
            <NavLink
              key={href}
              onClick={() => {}}
              to={href}
              className={() =>
                cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{label}</span>
                </div>
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
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-4 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};
