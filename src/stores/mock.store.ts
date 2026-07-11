import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ENV } from '@/constants';

type MockStore = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
};

/**
 * Controla el modo "mock" (turnos/pacientes en memoria) en runtime.
 * Se puede activar/desactivar desde el login y persiste en localStorage.
 * Valor inicial: ENV.USE_MOCKS.
 */
export const useMockStore = create<MockStore>()(
  persist(
    set => ({
      enabled: ENV.USE_MOCKS,
      setEnabled: enabled => set({ enabled }),
      toggle: () => set(state => ({ enabled: !state.enabled })),
    }),
    {
      name: 'mock-mode',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Lectura sincrónica para usar fuera de React (servicios).
export const isMockEnabled = () => useMockStore.getState().enabled;