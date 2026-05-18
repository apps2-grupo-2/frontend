import { ProfessionalDashboard } from '@/modules/professional-dashboard/professional-dashboard';
import { useAuthStore } from '@/stores/auth.store';

export default function Page() {
  const { name } = useAuthStore();
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 mx-auto max-w-2xl">
      <div className="mb-4">
        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
          Gestión de Turnos
        </p>
        <h1 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">Mi agenda</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">{name}</p>
      </div>
      <ProfessionalDashboard />
    </div>
  );
}