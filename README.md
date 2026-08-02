# equisproject

Aplicaciones logísticas para operaciones de importación en Perú.

**https://equisproject.online**

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
| QR / Barcode | Genera códigos QR o de barra con marco. Exporta PNG y PDF |
| Conversor de Unidades | Peso, volumen, longitud y temperatura |
| Packing List | Genera lista de empaque profesional en PDF |
| Comparador Incoterms | Compara riesgos, costos y responsabilidades de los 11 Incoterms® 2020 |

## Stack

- **Frontend:** React 19 + TypeScript + Vite 7
- **API:** Bun + Hono (proxy SUNAT)
- **Monorepo:** Bun workspaces
- **Deploy:** Render (Static Site)
- **Proxy CORS:** Cloudflare Worker

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
│   ├── web/              # Frontend React
│   │   └── src/apps/     # Mini apps (cada una es un módulo)
│   └── api/              # API proxy SUNAT
├── packages/
│   └── shared/           # Lógica compartida (tipos, taxes, incoterms)
├── worker/
│   └── index.js          # Cloudflare Worker (proxy CORS)
└── render.yaml           # Deploy config
```

## Agregar una app

1. Crear carpeta en `apps/web/src/apps/mi-app/`
2. Crear `index.tsx` con el componente
3. Crear `manifest.ts` con id, name, icon, accent, path
4. Agregar al registry en `apps/web/src/registry/index.ts`
5. Agregar ruta en `apps/web/src/App.tsx`

## Licencia

MIT
