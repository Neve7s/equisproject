# Implementation Plan: Generador de Liquidación Aduanera y DUA asistido

## Overview
Agregar una mini-app que reutilice el motor fiscal actual (`computeImportTaxes`) y el tipo de cambio existente, añada detracción configurable y exporte un PDF con liquidación + borrador de DUA. Sin APIs nuevas.

## Architecture Decisions
- La lógica nueva vive en `packages/shared/src/liquidacion.ts` como función pura: recibe el `TaxResult` o el `TaxInput` y devuelve líneas + totales. Así se testea sin React.
- `computeLiquidation` **compone** `computeImportTaxes` (no lo modifica); la percepción ya viene como una de sus líneas.
- Detracción = `cif * (tasa/100)`, tasa configurable 0–100, default 0. Se muestra como línea adicional.
- PDF con `jsPDF`, mismo enfoque que Packing List, con marca de agua diagonal.

## Task List

### Phase 1: Foundation (lógica + tests)
- [ ] Task 1: tests RED para `computeLiquidation` (total = CIF + tributos + detracción; USD/PEN; TC inválido).
- [ ] Task 2: implementar `computeLiquidation` + exportar desde `shared/index.ts` (GREEN).
- [ ] Task 3: typecheck + `bun test` completos.

**Checkpoint Foundation:** tests pasan, sin cambios en API.

### Phase 2: Mini-app
- [ ] Task 4: crear `index.tsx` con formulario (datos ejemplo, TC existente, detracción) y tabla de liquidación.
- [ ] Task 5: registrar manifest + ruta en `App.tsx` + `registry/index.ts`.
- [ ] Task 6: estilos en `styles.css` (tokens existentes, mismo lenguaje visual).

**Checkpoint Core:** app navegable, cálculo en pantalla correcto.

### Phase 3: PDF y verificación
- [ ] Task 7: generación de PDF con liquidación + borrador DUA y marca de agua.
- [ ] Task 8: verificación final (tests, typecheck, build, screenshot).
- [ ] Task 9: actualizar README con la nueva app.

**Checkpoint Complete:** todos los criterios del spec.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| El usuario interprete el DUA como oficial | Alto | Marca de agua visible + texto "borrador, no válido para SUNAT" en PDF y UI |
| Tasa de detracción errónea | Medio | Default 0%, campo editable y aclaración de que depende de la operación |
| Duplicar percepción | Medio | No agregar línea nueva: reutilizar `r.lines` de `computeImportTaxes` |

## Open Questions
- Ninguno bloqueante (el usuario pidió no tocar APIs de SUNAT; confirmado).
