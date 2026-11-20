# Spec: Generador de Liquidación Aduanera y DUA asistido

## Objective
Nueva mini-app dentro de equisproject que, reutilizando el cálculo de CIF y tributos ya existente, permita al usuario:
1. Completar datos de la operación (importador, mercancía, detracción).
2. Ver una liquidación aduanera desglosada (CIF + tributos + percepción + detracción).
3. Descargar un PDF imprimible con la liquidación y un **borrador de DUA** claramente marcado como tal.

Usuario: importadores y comerciales logísticos que necesitan un documento de trabajo, no una declaración oficial.

## Assumptions (confirmadas por el pedido)
1. **No se toca ninguna API de SUNAT.** Se reutiliza `useExchangeRate` → `/api/exchange-rate` (proxy existente a `apis.net.pe`). Cero endpoints nuevos, cero cambios en `apps/api` ni en `worker/`.
2. La **detracción** es una tasa configurable por el usuario (default 0%) aplicada al CIF. No se afirma una tasa SUNAT oficial; el helper diga "según tu operación".
3. La percepción **ya existe** en `computeImportTaxes`; no se duplica, solo se muestra en la liquidación.
4. El DUA es un **borrador con marca de agua** "BORRADOR — NO VÁLIDO PARA SUNAT". No es un formulario oficial ni se envía a ningún lado.
5. Los datos precargados son de **ejemplo** (sin RUC/razón social reales), coherente con las reglas del proyecto.
6. PDF se genera en el cliente con `jspdf` (ya instalado, mismo patrón que Packing List).

## Tech Stack
React 19 + TS + Vite 7 · Bun workspaces · `jspdf@^4.2.1` · lógica pura en `@equis/shared` · Bun test.

## Commands
- Test: `bun test` (y `bun test packages/shared/tests/liquidacion.test.ts`)
- Typecheck: `bun run typecheck`
- Build: `bun run build`
- Dev: `bun run dev`

## Project Structure
```
packages/shared/src/liquidacion.ts        # computeLiquidation (puro) + tipos
packages/shared/tests/liquidacion.test.ts # tests unitarios
apps/web/src/apps/liquidation-generator/  # index.tsx + manifest.ts + components/
apps/web/src/registry/index.ts            # registrar mini-app
apps/web/src/App.tsx                      # ruta /apps/liquidacion-generator
apps/web/src/styles.css                   # estilos de la nueva app
docs/spec-liquidacion-dua.md              # este spec
tasks/plan.md, tasks/todo.md              # plan y tareas
```

## Code Style
Igual que el resto: componentes funcionales, `className` con tokensCSS existentes, lógica fiscal en `shared` sin React, `round2` para montos, `formatMoney` para presentación. Sin llamadas de red nuevas.

## Testing Strategy
- Unit (Bun test): `computeLiquidation` — CIF + tributos + percepción + detracción, total, conversión USD/PEN, tasas 0, redondeo, errores de TC.
- Verificación runtime: build + screenshot del formulario y del PDF generado.

## Boundaries
- Always: tests antes de commit, sin datos reales de clientes, marca de agua en el DUA.
- Ask first: cambiar el endpoint de TC, añadir dependencias, tocar `apps/api` o `worker/`.
- Never: consumir APIs de SUNAT nuevas, presentar el borrador como declaración válida, almacenar RUC reales.

## Success Criteria
- [ ] `computeLiquidation` con tests pasando (incluye detracción y percepción sin duplicar).
- [ ] Mini-app visible en home y sidebar, con ruta propia.
- [ ] Formulario con datos de ejemplo, TC reutilizado del hook existente.
- [ ] PDF con liquidación + borrador de DUA con marca de agua.
- [ ] `bun test`, `bun run typecheck` y `bun run build` pasan.
- [ ] Sin cambios en `apps/api`, `worker/` ni consumo nuevo de APIs.
