# equisproject

[![equisproject.online](https://img.shields.io/badge/sitio-equisproject.online-34D399?style=flat-square)](https://equisproject.online)

Aplicaciones web **gratuitas** para operaciones de importación y logística en Perú. Sin login, sin registro y sin límites.

**🌐 https://equisproject.online**

## Características

- **100% gratis** — sin login, sin registro, sin límites
- **Moneda dual** USD / PEN con tipo de cambio SUNAT en tiempo real (con caché y *stale-cache*)
- **Tema claro / oscuro** con persistencia en `localStorage` y respeto a `prefers-reduced-motion`
- **Responsive** — desktop, tablet y móvil (320px en adelante)
- **Accesible** — navegación por teclado, foco visible y etapas de error/estado vacío
- **Modular** — agregar una nueva app es trivial (ver [Agregar una app](#agregar-una-app))

## Apps

| App | Descripción |
|-----|-------------|
| Calculadora de Impuestos de Importación | Calcula CIF, Ad Valorem, IGV de aduana, IPM, ISC y Percepción en USD/PEN |
| QR / Barcode | Genera códigos QR o de barras con marco personalizado; exporta PNG y PDF |
| Conversor de Unidades | Peso, volumen, longitud y temperatura para operaciones de envío |
| Packing List | Genera una lista de empaque profesional en PDF |
| Comparador Incoterms | Compara riesgos, costos y responsabilidades de los 11 Incoterms® 2020 |

## Stack

- **Frontend:** React 19 + TypeScript + Vite 7
- **API:** Bun + Hono (proxy del tipo de cambio SUNAT + servidor estático)
- **Monorepo:** Bun workspaces
- **Deploy:** Render (Web Service)
- **Proxy CORS:** Cloudflare Worker (alternativa al proxy Bun)

## Inicio rápido

Requiere [Bun](https://bun.sh) 1.1+.

```bash
# Clonar e instalar dependencias
git clone https://github.com/Neve7s/equisproject.git
cd equisproject
bun install

# Desarrollo (frontend + API en paralelo, según necesites)
bun run dev        # frontend
bun run dev:api    # API

# Verificación
bun test           # tests de lógica compartida
bun run typecheck  # tipos de shared + web
bun run build      # build de producción
bun run production # build + arranque de la API
```

No se requiere un archivo `.env`: el tipo de cambio se obtiene de la API pública de `apis.net.pe` y se cachea en memoria durante 1 hora.

## Comandos

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Servidor de desarrollo del frontend |
| `bun run dev:api` | Servidor de desarrollo de la API (Bun + Hono) |
| `bun run build` | Build de producción del frontend |
| `bun run start` | Arranca la API en producción |
| `bun run production` | Build + arranque de la API |
| `bun test` | Tests de la lógica compartida |
| `bun run typecheck` | Verificación de tipos (shared + web) |
| `bun run preview` | Vista previa local del build |

## Arquitectura

```
apps/
├── web/                  # Frontend React
│   ├── src/app/          # Layout, home, sidebar, 404
│   ├── src/apps/         # Mini apps (cada una es un módulo)
│   ├── src/lib/          # Hooks y constantes compartidas (tema, contacto, SEO)
│   ├── src/registry/     # Registro de mini apps y sus íconos
│   └── src/styles.css    # Sistema de diseño (tokens + componentes)
├── api/                  # API Bun + Hono
│   └── src/index.ts      # /api/exchange-rate, /api/health y sirve web/dist
packages/
└── shared/               # Lógica pura: taxes, currency, incoterms, types
worker/
└── index.js              # Cloudflare Worker (proxy CORS a SUNAT)
render.yaml               # Configuración de deploy en Render
```

Decisiones clave:
- **Lógica fiscal pura en `packages/shared`**, sin dependencias de React — permite testearla con `bun test`.
- **El tipo de cambio nunca se llama directamente desde el navegador**; pasa por la API (o el Worker) para evitar CORS y aplicar caché. Si la API SUNAT falla, se sirve el último valor válido (*stale-cache*).
- **Cada mini app se autorregistra** mediante un `manifest.ts`, de modo que el home y el sidebar se generan desde una sola fuente.

## Agregar una app

1. Crear la carpeta en `apps/web/src/apps/mi-app/`
2. Crear `index.tsx` con el componente
3. Crear `manifest.ts` con `id`, `name`, `icon`, `accent`, `path` y `Component`
4. Registrarla en `apps/web/src/registry/index.ts`
5. Agregar la ruta en `apps/web/src/App.tsx`

## Sugerencia: próxima herramienta de alto impacto

La herramienta más poderosa que encaja con el producto es un **Generador de Liquidación Aduanera y DUA asistido**:

- Reutiliza el CIF y los impuestos que ya calcula la app actual.
- Agrega detracciones, percepción y un desglose por partida.
- Exporta un **PDF imprimible** con la liquidación y un **borrador de DUA** prellenado.
- Impacto: convierte equisproject de "calculadoras" en un **generador de documentos**, que es donde está el valor real para el usuario.

Alternativas ordenadas por impacto/esfuerzo: (2) calculadora de **detracciones SUNAT**, (3) **histórico y alertas de tipo de cambio** con gráficas, (4) **cotizador de fletes** comparando Incoterms.

## Contacto y sugerencias

¿Encontraste un error o tienes una idea? Envíala directamente por WhatsApp:

- **WhatsApp:** +51 935 533 845 — [enviar sugerencia](https://wa.me/51935533845?text=Hola%2C%20quiero%20sugerir%20una%20mejora%20para%20equisproject%3A)
- **GitHub:** https://github.com/Neve7s/equisproject

El número de contacto está centralizado en `apps/web/src/lib/contact.ts` (UI) y en esta sección (documentación).

## Licencia

MIT — ver [LICENSE](LICENSE).
