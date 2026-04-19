# Health Grid — Arquitectura y Contexto del Proyecto

## Descripción general

**Health Grid** es un sistema de gestión hospitalaria modular. Cada módulo es desarrollado por un equipo distinto. Este repositorio corresponde al **frontend compartido**, donde cada módulo integra sus páginas bajo un layout y sistema de diseño común.

El proyecto se encuentra en etapa de desarrollo con datos mockeados. La integración con backends reales se hace reemplazando las constantes `USE_MOCK = true` en los servicios.

---

## Stack tecnológico

| Herramienta | Versión | Rol |
|---|---|---|
| React | 19 | UI |
| TypeScript | 5.9 | Tipado estático |
| Vite | 7 | Bundler / dev server |
| Tailwind CSS | 4.2 | Estilos (CSS-first config) |
| shadcn/ui | — | Componentes base (adaptados) |
| React Router | 7 | Routing |
| Zustand | 5 | Estado global (auth) |
| TanStack Query | 5 | Server state / fetching |
| React Hook Form | 7 | Formularios |
| Axios | 1.1 | HTTP client |
| Lucide React | — | Iconografía |
| react-day-picker | 9 | Componente de calendario |
| class-variance-authority | — | Variantes de componentes |

Dev server corre en `http://localhost:5173`. Backend mock en `http://localhost:3000` (json-server con `db.json`).

---

## Estructura de carpetas

```
src/
├── App.tsx                  # Router principal
├── main.tsx                 # Entry point
├── index.css                # Variables CSS, Tailwind, scrollbar, reset
│
├── components/
│   ├── layouts/
│   │   ├── base-layout.tsx     # Layout con sidebar + main scrollable
│   │   ├── sidebar.tsx         # Sidebar con módulos, roles y animaciones
│   │   └── protected-route.tsx # Guard de roles
│   ├── rhf/                 # Wrappers de React Hook Form
│   │   ├── rhf-combobox.tsx
│   │   ├── rhf-select.tsx
│   │   └── rhf-tabs.tsx
│   └── ui/                  # Componentes base (shadcn adaptados)
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── combobox.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── step-navigation.tsx  # Botones Volver/Siguiente del wizard
│       ├── tabs.tsx
│       └── ...
│
├── pages/                   # Una página por ruta
│   ├── login.tsx
│   ├── appointments.tsx         # /turnos
│   ├── appointment-request.tsx  # /solicitar-turnos (wrapper del wizard)
│   ├── professional-calendar.tsx # /agenda-profesional
│   └── checkin.tsx              # /presentismo
│
├── modules/                 # Pasos del wizard de solicitud de turno
│   ├── appointment-initial.tsx      # Paso 1: Preferencias
│   ├── appointment-calendar.tsx     # Paso 2: Fecha y hora
│   ├── appointment-confirmation.tsx # Paso 3: Confirmación
│   └── appointment-success.tsx      # Paso 4: Éxito
│
├── hooks/
│   ├── use-appointments/        # Hook principal del wizard
│   └── use-appointments-data/   # Fetching de opciones (profesionales, especialidades, centros)
│
├── services/                # Capa HTTP (con flag USE_MOCK)
│   ├── auth.ts
│   └── appointments.ts
│
├── stores/
│   └── auth.store.ts        # Zustand: accessToken, role, name, subtitle
│
├── mocks/                   # Datos de prueba
│   ├── auth-mock.ts
│   ├── appointments-mock.ts
│   ├── checkin-mock.ts
│   └── professional-calendar-mock.ts
│
├── constants/
│   ├── routes.ts            # ROUTES object
│   ├── appointments.ts      # Enums y constantes de turnos
│   └── env.ts               # BASE_URL
│
├── typings/                 # Tipos TypeScript organizados por dominio
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
  role: 'paciente' | 'profesional' | 'administrativo' | undefined
  name: string | undefined       // Ej: "Fernandez Juan Pablo"
  subtitle: string | undefined   // Ej: "Cardiología · Electrofisiología"
  email: string | undefined
}
```

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

El sidebar lista 10 módulos. Solo el **Módulo 2 (Turnos y Agendas)** está implementado en este repositorio. Los otros son placeholders deshabilitados (`opacity-40`, `cursor-not-allowed`) con tooltip "Módulo en desarrollo por otro equipo".

| ID | Módulo | Estado |
|---|---|---|
| 1 | Historia Clínica | Placeholder |
| **2** | **Turnos y Agendas** | **Implementado** |
| 3 | Farmacia e Insumos | Placeholder |
| 4 | Laboratorio | Placeholder |
| 5 | Diagnóstico por Imágenes | Placeholder |
| 6 | Internación y Camas | Placeholder |
| 7 | Facturación | Placeholder |
| 8 | Portal del Paciente | Placeholder |
| 9 | Monitoreo | Placeholder |
| 10 | Core | Placeholder |

El sidebar tiene animación de acordeón CSS (grid trick `grid-rows-[0fr→1fr]`) con stagger en los sub-items. Solo el módulo activo del usuario se muestra según rol.

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
Wizard de 4 pasos controlado por `UseAppointments` hook + `payloadRef` (acumulador del formulario multi-paso):

**Paso 0 — `Appointment_Initial`**: Tipo de turno (por especialidad / por profesional), especialidad, prioridad (cercanía / primera disponibilidad), centro médico. Usa RHF + Combobox + Select encadenados.

**Paso 1 — `Appointment_Calendar`**: Layout dos columnas — calendario (react-day-picker) | slots de horario en grilla 2 cols. Fechas habilitadas desde mock. Al cambiar fecha, slots entran con animación escalonada.

**Paso 2 — `Appointment_Confirmation`**: Resumen de los datos acumulados en `payloadRef.current`. Solo lectura.

**Paso 3 — `Appointment_Success`**: Ícono animado (zoom-in), ID de turno generado con `Math.random()`. TODO: vendrá del POST `/appointments`.

El stepper en la parte superior muestra progreso (no se renderiza en el paso de éxito).

### `/agenda-profesional` — `profesional` y `administrativo`

**Para `profesional`**: muestra solo su propia agenda (busca por nombre en el mock), sin selector de profesional. Título: "Mi agenda".

**Para `administrativo`**: incluye dropdown para cambiar el profesional visualizado. Título: "Agenda Profesional".

Tabs de días Lun–Vie. Slots con colores por estado: confirmado (verde), pendiente (ámbar), cancelado (tachado), disponible (verde suave), bloqueado (gris).

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

- **Nombres de páginas**: default export `function Page()` en `/pages/`
- **Nombres de módulos**: named export `Appointment_NombrePaso` en `/modules/`
- **Servicios**: flag `USE_MOCK = true` al tope del archivo para alternar entre mock y real
- **TODOs**: marcados con `// TODO: reemplazar con METHOD /endpoint` indicando el contrato esperado
- **Alias de imports**: `@/` apunta a `src/`
- **Tipados**: en `src/typings/` organizados por `services/`, `stores/`, `modules/`, `components/`

---

## Integración con backend (pendiente)

Todos los servicios tienen un switch `USE_MOCK`. Al pasar a `false`, usan Axios contra `http://localhost:3000` (configurable en `src/constants/env.ts`).

| Endpoint esperado | Usado en |
|---|---|
| `POST /auth/sign-in` | `services/auth.ts` |
| `GET /professionals` | `services/appointments.ts` |
| `GET /specialties` | `services/appointments.ts` |
| `GET /medical_centers?priority=` | `services/appointments.ts` |
| `GET /professionals/:id/schedule?weekStart=` | `pages/professional-calendar.tsx` |
| `POST /appointments/reserve` | `modules/appointment-calendar.tsx` |
| `POST /appointments` | `modules/appointment-confirmation.tsx` |
| `DELETE /appointments/:id` | `pages/appointments.tsx` |
| `PATCH /appointments/:id/checkin` | `pages/checkin.tsx` |

El módulo Core (equipo externo) proveerá: autenticación JWT, listado de profesionales, especialidades.
