import axios from 'axios';

import { ENV } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Acceso a los usuarios del backend Core (modulo 10).
 * El Core es la fuente de verdad de usuarios, roles y especialidades.
 * Se usa para resolver profesionales y pacientes en modo real
 * (antes mockeados porque el Core no exponia el listado).
 */

export type CoreRole = { id: number; name: string };
export type CoreSpeciality = { id: number; name: string };

export type CoreUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  roles?: CoreRole[];
  specialities?: CoreSpeciality[];
};

type CorePaginatedUsers = {
  data: CoreUser[];
  total?: number;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
};

const PAGE_SIZE = 100;

const authHeaders = (): Record<string, string> => {
  const { accessToken } = useAuthStore.getState();
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export const coreFullName = (u: CoreUser): string =>
  `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || (u.email ?? `#${u.id}`);

// Mismo criterio por substring que usa authLogin para resolver el rol.
const PROFESSIONAL_KEYS = ['medic', 'médic', 'doctor', 'profesional', 'professional'];

export const isProfessional = (roles: CoreRole[] = []): boolean =>
  roles.some(r => {
    const name = (r.name ?? '').toLowerCase();
    return PROFESSIONAL_KEYS.some(k => name.includes(k));
  });

/** Trae todos los usuarios del Core paginando GET /users. */
export const fetchAllCoreUsers = async (): Promise<CoreUser[]> => {
  const url = `${ENV.CORE_BASE_URL}/users`;
  const headers = authHeaders();

  const first = await axios.get<CorePaginatedUsers>(url, {
    headers,
    params: { page: 1, pageSize: PAGE_SIZE },
  });

  const users = [...(first.data.data ?? [])];
  const total = first.data.total ?? users.length;
  const pageSize = first.data.pagination?.pageSize || PAGE_SIZE;
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 1;

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        axios
          .get<CorePaginatedUsers>(url, { headers, params: { page: i + 2, pageSize: PAGE_SIZE } })
          .then(r => r.data.data ?? [])
      )
    );
    users.push(...rest.flat());
  }

  return users;
};

/**
 * Igual que fetchAllCoreUsers pero garantiza roles[] y specialities[].
 * Si el listado no los embebe, completa con GET /users/{id} solo para
 * los que falten. Necesario para filtrar profesionales por especialidad.
 */
export const fetchCoreUsersDetailed = async (): Promise<CoreUser[]> => {
  const users = await fetchAllCoreUsers();
  const needsDetail = users.some(u => u.roles === undefined || u.specialities === undefined);
  if (!needsDetail) return users;

  const headers = authHeaders();
  return Promise.all(
    users.map(async u => {
      if (u.roles !== undefined && u.specialities !== undefined) return u;
      try {
        const { data } = await axios.get<CoreUser>(`${ENV.CORE_BASE_URL}/users/${u.id}`, { headers });
        return { ...u, ...data };
      } catch {
        return u;
      }
    })
  );
};
