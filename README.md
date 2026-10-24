# AutoControl Car Wash

Aplicación de gestión diaria en Vue 3 con TypeScript, Vite y Tailwind CSS 4. La estructura sigue una arquitectura orientada al dominio: cada módulo contiene las capacidades de una funcionalidad y el estado compartido de la operación se coordina con Pinia.

## Requisitos

- Node.js 20.19+ o 22.12+
- Un proyecto de Supabase con las tablas `businesses`, `sales`, `expenses` y `cash_closings`, además de sus políticas RLS.

## Desarrollo

```sh
pnpm install
```

El archivo `.env` local ya está preparado con las variables de Supabase encontradas en el HTML original y está excluido de Git. Si necesitas recrearlo, copia `.env.example` y completa la URL del proyecto y su clave **publishable**:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Nunca uses una `service_role` o una clave `sb_secret_` en una aplicación de navegador. Los valores `VITE_*` se incluyen en el bundle del cliente; la publishable key debe usarse con políticas RLS correctamente configuradas.

```sh
pnpm dev
```

## Producción

```sh
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
pnpm preview
```

`pnpm format` formatea el proyecto. En VS Code, con Prettier instalado (extensión recomendada), guardar con `Ctrl+S` aplica el formato automáticamente.

## Estructura

```text
src/
├── assets/
├── modules/
│   ├── auth/{components,composables}/
│   ├── autocontrol/
│   │   ├── models/business.models.ts
│   │   └── stores/autocontrol.store.ts
│   ├── cash-closing/{components,composables,models}/
│   ├── dashboard/components/
│   ├── expenses/{components,composables,models}/
│   ├── movements/{components,composables,lib,models}/
│   └── sales/{components,composables,models}/
└── shared/
    ├── lib/
    │   ├── dates.ts
    │   ├── formatters.ts
    │   └── supabase.ts
    └── models/payment.models.ts
```

Los contratos del dominio se guardan en `models/[nombre].models.ts`; los stores en `[nombre].store.ts`. Los composables, cuando se necesitan, usan el prefijo `use` (por ejemplo, `useAutocontrol.ts`). La lógica de interfaz vive en componentes Vue por funcionalidad. El store Pinia de autocontrol coordina la sesión, el negocio y las mutaciones de Supabase; las utilidades compartidas concentran formato, fechas y creación del cliente.

## Análisis de producto

Consulta [el análisis del MVP vendible](./docs/analisis-mvp-producto.md) para comparar lo implementado con las necesidades comerciales y las prioridades siguientes.

La especificación funcional y los criterios de aceptación del piloto están en [spec-mvp-carwash.md](./docs/spec-mvp-carwash.md).
