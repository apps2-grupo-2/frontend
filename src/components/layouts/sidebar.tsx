import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  BedDouble,
  Calendar,
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

import type { Module, ModuleButtonProps } from '@/typings/components/layouts/sidebar';
import { ROUTES, USER_TYPE } from '@/constants';
import { getUserInitials } from '@/helpers/helpers';
import { useGetModules } from '@/hooks/use-others-data';
import { requestSsoTicket } from '@/services/auth';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

const icons = {
  1: FileText,
  2: Calendar,
  3: Pill,
  4: FlaskConical,
  5: ScanLine,
  6: BedDouble,
  7: Receipt,
  8: UserRound,
  9: Monitor,
  10: Settings,
};

export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 h-screen flex-col shrink-0 border-r border-sidebar-border bg-sidebar lg:flex">
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
              <SidebarContent />
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

const SidebarContent = () => {
  const navigate = useNavigate();
  const { role, name, subtitle, resetStore } = useAuthStore();
  const { data: modules } = useGetModules();

  const handleLogout = () => {
    resetStore();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const modulesParsed: Module[] =
    modules?.map(a => ({
      id: a.modulo,
      label: a.titulo,
      icon: icons[Number(a.modulo) as keyof typeof icons],
      url: a.url,
    })) ?? [];

  const userInitials = getUserInitials(name);

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
          {modulesParsed.map(a => (
            <ModuleButton key={a.id} role={role} mod={a} />
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
  const { mod, role } = props;
  const navigate = useNavigate();
  const isActiveModule = mod.id === '2';

  const goTo = async (m: Module) => {
    if (isActiveModule && role) {
      if (role === USER_TYPE.PATIENT) {
        navigate(ROUTES.TURNOS, { replace: true });
      } else if (role === USER_TYPE.PROFESSIONAL) {
        navigate(ROUTES.AGENDA_PROFESIONAL, { replace: true });
      } else {
        navigate(ROUTES.PRESENTISMO, { replace: true });
      }
      return;
    }

    // Navegación a OTRO módulo con SSO: pedimos un ticket efímero al core y lo
    // pasamos en la URL; el backend del módulo destino lo canjea en su /auth/sso
    // y deja al usuario ya logueado. Si no hay ticket (mock/sin sesión/error),
    // caemos al redirect directo (el usuario tendrá que loguearse allá).
    const ticket = await requestSsoTicket();
    const base = m.url.replace(/\/+$/, '');
    window.location.href = ticket
      ? `${base}/auth/sso?ticket=${encodeURIComponent(ticket)}&redirect=${encodeURIComponent('/')}`
      : m.url;
  };

  return (
    <div
      onClick={() => void goTo(mod)}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-3 cursor-pointer',
        isActiveModule
          ? 'bg-sidebar-accent font-medium text-sidebar-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent'
      )}
    >
      <mod.icon className="h-4 w-4 shrink-0 text-sidebar-foreground" />
      <span className="text-sm text-sidebar-foreground select-none">{mod.label}</span>
    </div>
  );
};