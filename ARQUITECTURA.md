# Health Grid — Arquitectura y Contexto del Proyecto

## Descripción general

**Health Grid** es un sistema de gestión hospitalaria modular. Cada módulo es desarrollado por un equipo distinto. Este repositorio corresponde al **frontend compartido**, donde cada módulo integra sus páginas bajo un layout y sistema de diseño común.

El proyecto se encuentra en etapa de desarrollo con un enfoque mixto: algunos servicios consumen la API real (`https://dev.solefrancisco.com/apps2/api/v1`), mientras que otros usan datos mockeados localmente con latencia simulada. El listado de módulos del sidebar se obtiene desde un Cloudflare Worker externo.

---

## Stack tecnológico

| Herramienta | Versión | Rol |
|---|---|---|
| React | 19.2 | UI |
| TypeScript | 6.0 | Tipado estático |
| Vite | 8.0 | Bundler / dev server |
| Tailwind CSS | 4.3 | Estilos (CSS-first config) |
| shadcn/ui | 4.7 | Componentes base (adaptados, solo CLI) |
| Radix UI | 1.4 | Primitivos de accesibilidad |
| Base UI React | 1.3 | Componentes headless |
| React Router | 7.13 | Routing |
| Zustand | 5.0 | Estado global (auth) |
| TanStack Query | 5.96 | Server state / fetching |
| React Hook Form | 7.72 | Formularios |
| Axios | 1.14 | HTTP client |
| date-fns | 4.1 | Utilidades de fechas |
| Lucide React | 1.7 | Iconografía |
| react-day-picker | 9.14 | Componente de calendario |
| class-variance-authority | 0.7 | Variantes de componentes |
| tw-animate-css | 1.4 | Animaciones Tailwind |
| Biome | 2.4 | Linting y formatting |
| Vitest | 4.1 | Testing |
| Husky | 9.1 | Git hooks |
| React Compiler (babel) | 1.0 | Optimización automática de re-renders |

Dev server corre en `http://localhost:5173`. API de desarrollo en `https://dev.solefrancisco.com/apps2/api/v1`.

---

## Estructura de carpetas

```
src/
├── App.tsx                  # Router principal (lazy loading de páginas)
├── main.tsx                 # Entry point
├── index.css                # Variables CSS, Tailwind, tw-animate-css, scrollbar, reset
│
├── components/
│   ├── layouts/
│   │   ├── base-layout.tsx     # Layout con sidebar + main scrollable
│   │   ├── sidebar.tsx         # Sidebar dinámico (carga módulos desde API externa)
│   │   └── protected-route.tsx # Guard de roles
│   ├── rhf/                 # Wrappers de React Hook Form
│   │   ├── rhf-calendar.tsx
│   │   ├── rhf-chips.tsx
│   │   ├── rhf-combobox.tsx
│   │   ├── rhf-select.tsx
│   │   └── rhf-tabs.tsx
│   └── ui/                  # Componentes base (shadcn adaptados)
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── chip.tsx
│       ├── combobox.tsx
│       ├── confirm-dialog.tsx
│       ├── dialog.tsx
│       ├── divider.tsx
│       ├── field.tsx
│       ├── field-skeleton.tsx
│       ├── form-control.tsx
│       ├── grid.tsx
│       ├── input.tsx
│       ├── input-group.tsx
│       ├── label.tsx
│       ├── pagination.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── step-navigation.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       └── appointments-card.tsx
│
├── pages/                   # Una página por ruta, agrupadas por rol
│   ├── login.tsx
│   ├── patient/
│   │   ├── appointments.tsx         # /turnos
│   │   └── appointment-schedule.tsx # /solicitar-turnos (wrapper del wizard)
│   ├── professional/
│   │   └── professional-calendar.tsx # /agenda-profesional
│   └── administrative/
│       └── checkin.tsx              # /presentismo
│
├── modules/                 # Lógica de negocio por feature
│   ├── appointment-schedule/        # Wizard de solicitud de turno
│   │   ├── index.ts
│   │   ├── appointment-initial/     # Paso 1: Preferencias
│   │   │   ├── appointment-initial.tsx
│   │   │   ├── components/
│   │   │   ├── helpers/
│   │   │   ├── hooks/
│   │   │   └── index.ts
│   │   ├── appointment-confirmation/ # Paso 2: Confirmación
│   │   │   ├── appointment-confirmation.tsx
│   │   │   └── index.ts
│   │   ├── appointment-success/     # Paso 3: Éxito
│   │   │   ├── appointment-success.tsx
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   └── stepper.tsx
│   │   └── hooks/
│   │       └── use-appointment-labels.ts
│   └── professional-dashboard/      # Dashboard del profesional
│       ├── professional-dashboard.tsx
│       ├── components/
│       │   ├── weekday-selector.tsx  # Navegación y tabs de semana/día
│       │   └── day-status.tsx        # Stats del día (turnos/disponibles)
│       └── helpers/
│           └── helpers.ts           # getWeekdaysByOffset()
│
├── hooks/                   # Hooks de datos (TanStack Query)
│   ├── use-appointments/
│   ├── use-appointments-data/
│   ├── use-medical-centers-data/
│   ├── use-others-data/         # useGetModules() (módulos del sidebar)
│   ├── use-professionals-data/
│   └── use-specialties-data/
│
├── services/                # Capa HTTP (mixto: API real + mocks locales)
│   ├── auth.ts              # Mock local (MOCK_USERS)
│   ├── appointments.ts      # API real (Axios)
│   ├── professionals.ts     # Mock local (professionalsMock)
│   ├── specialties.ts       # Mock local (specialtiesMock)
│   ├── medical-centers.ts   # Mock local (MOCK_MEDICAL_CENTERS)
│   └── others.ts            # API externa (Cloudflare Worker)
│
├── stores/
│   └── auth.store.ts        # Zustand con persist (sessionStorage)
│
├── mocks/                   # Datos de prueba
│   ├── auth-mock.ts
│   ├── appointments-mock.ts
│   ├── checkin-mock.ts
│   ├── professional-calendar-mock.ts
│   ├── professionals.mock.ts
│   └── specialties.mock.ts
│
├── helpers/
│   ├── helpers.ts           # formatDate(), getUserInitials()
│   └── helpers.test.ts
│
├── lib/
│   ├── axios.ts             # Instancia de Axios configurada
│   ├── utils.ts             # cn() (clsx + tailwind-merge), formatDate()
│   └── mock-data.ts
│
├── constants/
│   ├── routes.ts            # ROUTES object
│   ├── appointments.ts      # Enums y constantes de turnos
│   ├── env.ts               # BASE_URL, MOCK_BASE_URL
│   └── index.ts             # Re-exports
│
├── typings/                 # Tipos TypeScript organizados por dominio
│   ├── components/
│   │   ├── layouts/
│   │   ├── rhf/
│   │   └── ui/
│   ├── hooks/
│   ├── modules/
│   ├── services/
│   └── stores/
│
└── providers/
    └── tanstack-query-provider/
```

---

## Autenticación y roles

### Roles del sistema

| Rol | Valor | Home | Descripción |
|---|---|---|---|
| Paciente | `'paciente'` | `/turnos` | Ve y solicita sus propios turnos |
| Profesional | `'profesional'` | `/agenda-profesional` | Ve solo su propia agenda |
| Administrativo | `'administrativo'` | `/presentismo` | Acceso a presentismo y agenda de cualquier profesional |

### Auth store (Zustand, persiste en `sessionStorage`)

```typescript
{
  accessToken: string | undefined
  refreshToken: string | undefined
  autoLogin: boolean
  dni: string | undefined
  id: string | undefined
  role: 'paciente' | 'profesional' | 'administrativo' | undefined
  name: string | undefined       // Ej: "Fernandez Juan Pablo"
  subtitle: string | undefined   // Ej: "Cardiología · Electrofisiología"
  email: string | undefined
  logoutRequired: boolean
}
```

Métodos: `setAuth()`, `logout()`, `enableAutoLogin()`, `resetStore()`.

### Usuarios de prueba

| DNI | Password | Rol | Nombre | Subtitle |
|---|---|---|---|---|
| `28345671` | `1234` | paciente | González María Elena | OSDE 310 |
| `20987654` | `1234` | profesional | Fernandez Juan Pablo | Cardiología · Electrofisiología |
| `33112233` | `1234` | administrativo | Sosa Rodrigo | Administración |

### Protección de rutas

`ProtectedRoute` redirige a `/login` si no hay sesión, o al home del rol si no tiene permiso.

```typescript
const ROLE_HOME = {
  paciente: '/turnos',
  profesional: '/agenda-profesional',
  administrativo: '/presentismo',
}
```

---

## Módulos del sistema (sidebar)

El sidebar carga dinámicamente la lista de módulos desde una API externa (Cloudflare Worker en `http://da2.mattalbarenque.workers.dev/modules`) usando el hook `useGetModules()`. Solo el **Módulo 2 (Turnos y Agendas)** está implementado en este repositorio. Los otros módulos redirigen a URLs externas de otros equipos.

Cada módulo se mapea a un ícono de lucide-react (FileText, Calendar, Pill, Flask, Scan, Bed, Receipt, User, Monitor, Settings).

Para el Módulo 2, el sidebar redirige según el rol del usuario:
- Paciente → `/turnos`
- Profesional → `/agenda-profesional`
- Administrativo → `/presentismo`

El sidebar es responsive: barra lateral fija en desktop, drawer con hamburguesa en mobile.

---

## Rutas y páginas (Módulo 2)

### `/login`
- Formulario de acceso con DNI + contraseña
- Panel de acceso rápido (demo) con los 3 roles
- Al autenticar: redirige al home del rol

### `/turnos` — solo `paciente`
- Lista de turnos próximos del paciente (`upcomingAppointments` de `mock-data.ts`)
- Acciones: Reprogramar (navega a `/solicitar-turnos`), Cancelar (con confirmación inline)
- Estado local con `useState` hasta tener backend
- Botón "Solicitar turno" → `/solicitar-turnos`

### `/solicitar-turnos` — solo `paciente`
Wizard de 3 pasos controlado por `UseAppointments` hook + `payloadRef` (acumulador del formulario multi-paso). Cada paso es un sub-módulo dentro de `modules/appointment-schedule/`:

**Paso 0 — `Appointment_Initial`**: Tipo de turno (por especialidad / por profesional), especialidad, prioridad (cercanía / primera disponibilidad), centro médico, fecha y hora. Usa RHF + Combobox + Select + Calendar encadenados. Tiene sub-carpetas propias de `components/`, `helpers/` y `hooks/`.

**Paso 1 — `Appointment_Confirmation`**: Resumen de los datos acumulados en `payloadRef.current`. Solo lectura.

**Paso 2 — `Appointment_Success`**: Ícono animado (zoom-in), ID de turno generado. TODO: vendrá del POST `/appointments`.

El componente `Stepper` en la parte superior muestra progreso (no se renderiza en el paso de éxito).

### `/agenda-profesional` — `profesional` y `administrativo`

**Para `profesional`**: muestra solo su propia agenda (busca por nombre en el mock), sin selector de profesional. Título: "Mi agenda".

**Para `administrativo`**: incluye dropdown para cambiar el profesional visualizado. Título: "Agenda Profesional".

Usa el módulo `professional-dashboard/` con componentes extraídos:
- `WeekdaySelector`: navegación de semana y tabs de días Lun–Vie.
- `DayStatus`: stats del día (cantidad de turnos y disponibles).
- `SlotCard`: renderiza cada slot con colores por estado (confirmado, pendiente, cancelado, disponible, bloqueado).

Helper `getWeekdaysByOffset(weekOffset)` genera los días hábiles de una semana relativa usando `date-fns`.

### `/presentismo` — solo `administrativo`
- Lista de turnos del día con buscador (nombre, DNI, N° turno)
- Botón "Registrar llegada" con latencia simulada (800ms) y spinner
- Estado: `pending` → `arrived` (cambia el badge y oculta el botón)
- Stats en tiempo real: pendientes, presentes, total

---

## Sistema de diseño

### Paleta de colores (variables CSS en `index.css`)

```css
--primary:    #006747   /* verde institucional */
--secondary:  #004c36   /* verde oscuro */
--background: #fbfbf7   /* crema suave */
--sidebar:    #083624   /* verde muy oscuro */
--muted:      #eef1ea
--border:     #dde4df
--destructive:#c22b2b
--success:    #23a24b
```

### Layout

- Sidebar fijo: `h-screen`, 256px, `overflow-hidden`. Solo la nav interna tiene `overflow-y-auto`.
- Main: `flex-1 overflow-y-auto`. El contenedor raíz es `h-screen overflow-hidden`.
- Contenido centrado en cada página con `mx-auto` y max-width apropiado según el tipo de página.

### Anchos de página

| Página | Max-width |
|---|---|
| `appointment-request` | `max-w-2xl` (672px) |
| `appointments` | `max-w-2xl` (672px) |
| `checkin` | `max-w-2xl` (672px) |
| `professional-calendar` | `max-w-2xl` (672px) |

### Animaciones

- Entrada de páginas: `animate-in fade-in slide-in-from-bottom-2 duration-300`
- Transición entre pasos del wizard: `animate-in fade-in slide-in-from-bottom-3 duration-300` con `key={step}`
- Sidebar acordeón: `grid-rows-[0fr→1fr]` con `transition-[grid-template-rows] duration-250`
- Sub-items sidebar: `animate-in fade-in slide-in-from-left-2` con stagger de 40ms
- Stagger de cards: `style={{ animationDelay: idx * 60ms }}`
- Scrollbar: aparece al hover (`transition: background 0.2s ease`), desaparece con delay (`0.6s ease 0.8s`)

### Botones (`button.tsx`)

Variantes con CVA: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`.
Todos tienen: `active:translate-y-px active:scale-[0.97]`, `hover:shadow-sm/md`, `transition-all`.

---

## Convenciones

- **Componentes**: `export const` con arrow function (no `function` declarations)
- **Tipos**: siempre `type` en lugar de `interface`, salvo que una librería lo requiera
- **Nombres de páginas**: default export `function Page()` en `/pages/`
- **Nombres de módulos**: named export en `/modules/`
- **Servicios**: enfoque mixto — algunos usan API real con Axios, otros importan mocks directamente
- **TODOs**: marcados con `// TODO: reemplazar con METHOD /endpoint` indicando el contrato esperado
- **Alias de imports**: `@/` apunta a `src/`
- **Import de tipos**: usar `import type` siempre
- **Tipados**: en `src/typings/` organizados por `services/`, `stores/`, `modules/`, `components/`, `hooks/`
- **Lógica / marcado**: callbacks y lógica derivada se declaran antes del `return`, no inline en JSX
- **Linting**: Biome (no ESLint/Prettier)
- **Testing**: Vitest con lint-staged en pre-commit (solo tests relacionados)

---

## Integración con backend

### Estado actual

| Servicio | Fuente de datos | URL |
|---|---|---|
| `auth.ts` | Mock local (`MOCK_USERS`) | — |
| `appointments.ts` | API real (Axios) | `https://dev.solefrancisco.com/apps2/api/v1` |
| `professionals.ts` | Mock local (`professionalsMock`) | — |
| `specialties.ts` | Mock local (`specialtiesMock`) | — |
| `medical-centers.ts` | Mock local (`MOCK_MEDICAL_CENTERS`) | — |
| `others.ts` | API externa | `http://da2.mattalbarenque.workers.dev/modules` |

Los servicios con mock simulan latencia de ~50ms con `setTimeout`. La constante `MOCK_BASE_URL` (`http://localhost:3000`) está definida en `src/constants/env.ts` pero no se utiliza actualmente (el json-server local ya no es necesario).

### Endpoints esperados (pendientes de integración)

| Endpoint esperado | Usado en |
|---|---|
| `POST /auth/sign-in` | `services/auth.ts` |
| `GET /professionals` | `services/professionals.ts` |
| `GET /specialties` | `services/specialties.ts` |
| `GET /medical_centers?priority=` | `services/medical-centers.ts` |
| `GET /professionals/:id/schedule?weekStart=` | `pages/professional/professional-calendar.tsx` |
| `POST /appointments` | `modules/appointment-schedule/` |
| `DELETE /appointments/:id` | `pages/patient/appointments.tsx` |
| `PATCH /appointments/:id/checkin` | `pages/administrative/checkin.tsx` |

El módulo Core (equipo externo) proveerá: autenticación JWT, listado de profesionales, especialidades.
