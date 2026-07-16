import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * ErrorBoundary global: evita la pantalla en blanco si un componente lanza en
 * render. Muestra un mensaje y permite recargar. No captura errores async
 * (esos se manejan en los servicios/hooks).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">Algo salió mal</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Ocurrió un error inesperado en la aplicación. Probá recargar la página; si el problema persiste, volvé a
            iniciar sesión.
          </p>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary"
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}