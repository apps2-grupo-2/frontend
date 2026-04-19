# Convenciones de código

## Componentes

- Declarar componentes usando **`export const`** con **arrow function**.
- No usar `function` declarations ni `export { Component }` al final del archivo.

```tsx
// Correcto
export const MyComponent = (props: MyComponentProps) => {
  const { className, ...rest } = props;

  return <div className={className} {...rest} />;
};

// Incorrecto
function MyComponent({ className, ...props }: MyComponentProps) {
  return <div className={className} {...props} />;
}
export { MyComponent };
```

## Tipos (Props)

- Los tipos se declaran en la carpeta `src/typings/`, respetando la misma estructura de carpetas del código fuente.
  - Componentes UI: `src/typings/components/ui/`
  - Componentes de layout: `src/typings/components/layouts/`
  - Componentes RHF: `src/typings/components/rhf/`
  - Módulos: `src/typings/modules/`
  - Hooks: `src/typings/hooks/`
  - Servicios: `src/typings/services/`
  - Stores: `src/typings/stores/`
- Los tipos de props de sub-componentes de un módulo se colocan en el archivo de tipos del módulo padre.
- Los tipos de componentes reutilizables de `src/components/ui/` van en `src/typings/components/ui/`, respetando el mismo nombre de archivo del componente (e.g. `calendar.tsx` → `src/typings/components/ui/calendar.ts`).
- Usar `import type` para importar tipos.

```tsx
// Correcto — componente reutilizable UI: tipo en typings/components/ui/
import type { CalendarProps } from '@/typings/components/ui/calendar';

export const Calendar = (props: CalendarProps) => {
  const { label } = props;
  // ...
};

// Correcto — sub-componente de módulo: tipo en typings/modules/ del padre
import type { SomeSubProps } from '@/typings/modules/appointment-initial';

// Incorrecto — tipo definido en el mismo archivo del componente
type CalendarProps = { label: string };
```

## Separación lógica / marcado

- Declarar callbacks, funciones de validación, transformaciones y lógica derivada **antes del `return`**, como variables o funciones del componente.
- No escribir lógica inline compleja dentro del JSX. Las props deben recibir referencias a variables/funciones ya declaradas.

```tsx
// Correcto — lógica declarada arriba, JSX limpio
const disabledDates = (date: Date) => !enabledDates.some(d => isSameDay(d, date));

return <RhfCalendar disabledDates={disabledDates} />;

// Incorrecto — lógica inline en el JSX
return (
  <RhfCalendar
    disabledDates={date =>
      !enabledDates.some(d => d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth())
    }
  />
);
```
