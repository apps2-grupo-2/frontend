# Health Grid — Módulo 2: Turnos y Agendas (Frontend)

SPA del **Módulo 2 (Turnos y Agendas)** del sistema hospitalario multi-módulo *Health Grid*. Permite a **pacientes** sacar y gestionar turnos, a **profesionales** ver su agenda y atender consultas, y al **administrativo** registrar la llegada de los pacientes (presentismo).

---

## Stack

| Área | Tecnología |
|---|---|
| Framework | React 19 + Vite 8 |
| Lenguaje | TypeScript (modo `strict`, `verbatimModuleSyntax`) |
| Ruteo | react-router-dom 7 |
| Estado servidor | TanStack Query (React Query) 5 |
| Estado global | Zustand 5 |
| Formularios | react-hook-form 7 |
| HTTP | axios |
| Fechas | date-fns 4 |
| Estilos | Tailwind CSS 4 + componentes propios (radix-ui / base-ui) |
| Íconos | lucide-react |
| Lint/format | Biome |
| Tests | Vitest |
| Gestor de paquetes | **pnpm** (obligatorio — hay un `only-allow pnpm`) |

---

## Cómo correrlo

Requisitos: Node 20+ y `pnpm`.

```bash
pnpm install     # instalar dependencias
pnpm run dev     # levantar en modo desarrollo (http://localhost:5173)
```

Otros scripts:

```bash
pnpm run build   # type-check (tsc -b) + build de producción (vite build)
pnpm run test    # tests unitarios (vitest)
pnpm run lint    # chequeo con Biome
pnpm run lint:fix # arreglar lo autofixeable
pnpm run format  # formatear
```

---

## Arquitectura: dos backends

El front habla con **dos** backends distintos. Entender esta separación es clave.

**1. Backend propio (Módulo 2 — Turnos)** → `ENV.BASE_URL`
Turnos, especialidades, centros médicos, médicos y notificaciones. Además hace de **pasamanos (proxy)** hacia el Core para la autenticación.
Requiere en **todas** las requests el header `x-api-key: appointments-secret-key` **más** el JWT (`Authorization: Bearer <token>`). Ambos los agrega automáticamente el interceptor de `src/lib/api-key.ts`, que aplica **solo** a URLs que arrancan con `BASE_URL` (nunca al Core, para no romper el preflight CORS).

**2. Backend del Core (Módulo 10)** → `ENV.CORE_BASE_URL`
Gestión de usuarios y algunos endpoints de auth que el back propio no proxya (`verify-account`, `sso-exchange`).

### A dónde pega cada cosa

| Acción | Va a |
|---|---|
| Login / Registro / Olvidé contraseña / Reset password | **Back propio** (`BASE_URL/auth/*`) |
| Verificar cuenta / SSO exchange | **Core** (`CORE_BASE_URL/auth/*`) |
| Pedir ticket SSO (salir a otro módulo) | **Back propio** (`BASE_URL/auth/sso-ticket`) |
| Turnos, especialidades, centros, médicos | **Back propio** |
| Búsqueda de usuarios/pacientes | **Core** (`GET /users`, requiere permiso `users:read`) |

> **Importante sobre el registro:** el `POST /auth/register` va al back propio a propósito, porque el back hace un paso extra: le asigna el rol **PACIENTE** al usuario recién creado. Si se registrara directo contra el Core, el usuario quedaría sin rol y no podría sacar turnos (el back rechaza la creación con *"does not have a valid patient role"*). El autoregistro es **siempre paciente**; profesionales y administrativos los da de alta un admin cargándolos en el Core.

---

## Configuración de entorno

Toda la config vive en **`src/constants/env.ts`** (no hay `.env`; los valores están hardcodeados):

```ts
BASE_URL       // back propio de turnos. dev / test / prod:
               //   https://dev.solefrancisco.com/apps2/api/v1
               //   https://test.solefrancisco.com/apps2/api/v1
               //   https://app.solefrancisco.com/apps2/api/v1   (prod)
CORE_BASE_URL  // https://api.healthcare.cantero.ar
API_KEY        // appointments-secret-key
DEFAULT_GEO    // Obelisco (CABA) — fallback si el navegador no da geolocalización
```

---

## Roles y ruteo

Tres roles, con su pantalla de inicio. Las rutas están protegidas por rol en `src/components/layouts/protected-route.tsx`.

| Rol | Rol id (Core) | Home | Puede |
|---|---|---|---|
| `paciente` | 10 | `/turnos` | Ver/sacar/confirmar/cancelar sus turnos |
| `profesional` | 2 | `/agenda-profesional` | Ver su agenda, iniciar/finalizar consultas |
| `administrativo` | 13 | `/presentismo` | Registrar llegada de pacientes; crear turnos |

Resolución de rol (`src/services/auth.ts`, `resolveRole`): prioriza el **id de rol** que devuelve el Core (2 / 10) y cae al match por **nombre** ("administrativo", "medico", etc.) como respaldo.

### Rutas (`src/constants/routes.ts`)

```
/login  /register  /forgot-password  /verify-account  /auth/sso   (públicas / auth)
/turnos  /solicitar-turnos                                         (paciente)
/agenda-profesional                                                (profesional)
/presentismo  /crear-turno                                         (administrativo)
```

---

## SSO entre módulos

Health Grid comparte sesión entre módulos mediante tickets efímeros emitidos por el Core.

- **Emisor** (salir de Turnos hacia otro módulo): al hacer clic en un módulo del sidebar, `requestSsoTicket()` pide un ticket al back y redirige a `{url-del-otro-modulo}/auth/sso?ticket=...&redirect=/`.
- **Receptor** (entrar a Turnos desde otro módulo): `pages/auth-sso.tsx` lee el `ticket` de la URL y lo canjea vía `POST /auth/sso-exchange`, dejando la sesión iniciada.

---

## Estructura del proyecto

```
src/
├── App.tsx                # rutas + lazy loading de páginas
├── main.tsx               # entrypoint (importa el interceptor de api-key)
├── constants/             # env.ts, routes.ts, estados de turno, tipos de usuario
├── pages/                 # una página por vista, agrupadas por rol
│   ├── login / register / forgot-password / verify-account / auth-sso
│   ├── patient/           # turnos, solicitar turno
│   ├── professional/      # agenda del médico
│   └── administrative/    # presentismo (check-in), crear turno
├── modules/               # UI compleja por feature
│   ├── appointment-schedule/     # wizard de 3 pasos para sacar turno
│   ├── professional-dashboard/   # agenda + iniciar/finalizar consulta
│   └── administrative-check-in/  # buscador + lista + registrar llegada
├── services/              # llamadas HTTP (auth, appointments, medics, ...)
├── hooks/                 # hooks de datos (React Query) por dominio
├── stores/                # auth.store.ts (Zustand: token, id, rol, geo)
├── lib/                   # api-key.ts (interceptor), axios, utils
├── components/            # UI reutilizable (ui/, rhf/, layouts/)
├── helpers/               # utilidades (fechas, etc.)
└── typings/               # tipos TypeScript
```

### Servicios principales (`src/services/`)

- **`auth.ts`** — login, registro, recuperar/resetear contraseña, verificar cuenta, SSO (emisor y exchange), resolución de rol.
- **`appointments.ts`** — crear, listar, confirmar, reprogramar, cancelar, check-in, iniciar y finalizar turnos.
- **`medics.ts`** — `GET /medics`: **fuente única** de médicos. De acá derivan:
  - **`specialties.ts`** — especialidades (dedup por `speciality_id`).
  - **`professionals.ts`** — profesionales filtrados por especialidad.
- **`medical-centers.ts`** — centros médicos (ordenados por cercanía; requiere lat/lng, que salen de la geolocalización del navegador con fallback a `DEFAULT_GEO`).
- **`patients.ts` / `core-users.ts`** — búsqueda de pacientes contra el Core (`GET /users`, solo con permiso `users:read`).

---

## Ciclo de vida de un turno

```
PENDING_CONFIRMATION → CONFIRMED → CHECKED_IN → IN_PROGRESS → COMPLETED
   (crea el paciente)   (confirma   (registra    (inicia el   (finaliza
                         el paciente) el admin)    médico)      el médico)
```

También puede pasar a `CANCELLED`, `ABSENT` o `EXPIRED`. Reglas relevantes en la UI:

- El paciente puede **confirmar** el turno mientras esté Pendiente y no haya pasado su horario.
- Los turnos que **agenda el administrativo** quedan confirmados directamente (no requieren la confirmación del paciente).
- Un turno **Pendiente o Confirmado** se puede **reprogramar** (nueva fecha/horario, mismo médico) o **cancelar**.
- El **check-in** (admin) solo se permite si el turno está **CONFIRMED**.
- El médico solo puede **iniciar** la consulta a partir del horario del turno.

---

## Notas técnicas

- **Fechas sin zona horaria:** el back devuelve fechas en formato `"YYYY-MM-DD HH:mm:ss"` (UTC) **sin** marcador de zona. `helpers/dates.ts` (`parseApiDate`) las interpreta como hora local. Tenerlo presente al comparar contra `new Date()`.
