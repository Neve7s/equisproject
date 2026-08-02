# equisproject

Aplicaciones logísticas para operaciones de importación en Perú.

## Características

- **100% gratis** — sin login, sin registro, sin límites
- **Dual currency** — USD / PEN con tipo de cambio SUNAT en tiempo real
- **Tema claro / oscuro** — persiste en localStorage
- **Responsive** — funciona en desktop y móvil
- **Modular** — agregar una nueva app es trivial

## Apps

| App | Descripción |
|-----|-------------|
| Calculadora de Importación | Calcula CIF, IGV, IPM, ISC y Percepción |

## Stack

- **Frontend:** React 19 + TypeScript + Vite 7
- **API:** Bun + Hono (proxy SUNAT)
- **Monorepo:** Bun workspaces
- **Deploy:** Render

## Desarrollo

```bash
# Instalar dependencias
bun install

# Desarrollo
bun run dev

# Build
bun run build

# Tests
bun test
```

## Estructura

```
├── apps/
│   ├── web/          # Frontend React
│   └── api/          # API proxy SUNAT
├── packages/
│   └── shared/       # Lógica compartida (tipos, taxes, incoterms)
└── render.yaml       # Deploy config
```

## Licencia

MIT
