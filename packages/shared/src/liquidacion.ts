import { round2 } from "./currency";
import { computeImportTaxes, type TaxError, type TaxInput, type TaxResult } from "./taxes";

export interface LiquidationInput extends TaxInput {
  /** Porcentaje del CIF retenido como detracción. Default 0 (según la operación). */
  detraccionRate: number;
}

export interface LiquidationLine {
  key: string;
  label: string;
  rate: number;
  amountUsd: number;
  amountPen: number;
}

export function isLiquidationError(value: LiquidationResult | TaxError): value is TaxError {
  return "ok" in value && value.ok === false;
}

export interface LiquidationResult {
  cifUsd: number;
  cifPen: number;
  lines: LiquidationLine[];
  totalTaxesUsd: number;
  totalTaxesPen: number;
  percepcionUsd: number;
  percepcionPen: number;
  detraccionUsd: number;
  detraccionPen: number;
  totalUsd: number;
  totalPen: number;
}

/**
 * Compone el cálculo de importación existente con una detracción configurable.
 * La percepción NO se agrega de nuevo: ya viene dentro de `result.lines`.
 */
export function computeLiquidation(input: LiquidationInput): LiquidationResult | TaxError {
  const baseResult = computeImportTaxes(input);
  if ("ok" in baseResult && baseResult.ok === false) return baseResult;
  const base = baseResult as TaxResult;

  const safeRate = (value: unknown): number => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
  };

  const rate = safeRate(input.detraccionRate);
  const detraccionUsd = round2(base.cifUsd * (rate / 100));
  const detraccionPen = round2(detraccionUsd * input.tc);

  const percepcion = base.lines.find((line) => line.key === "percepcion");

  const lines: LiquidationLine[] = [
    ...base.lines.map((line) => ({
      key: line.key,
      label: line.label,
      rate: line.rate,
      amountUsd: line.amountUsd,
      amountPen: line.amountPen,
    })),
    {
      key: "detraccion",
      label: "Detracción",
      rate,
      amountUsd: detraccionUsd,
      amountPen: detraccionPen,
    },
  ];

  return {
    cifUsd: base.cifUsd,
    cifPen: base.cifPen,
    lines,
    totalTaxesUsd: base.totalTaxesUsd,
    totalTaxesPen: base.totalTaxesPen,
    percepcionUsd: percepcion?.amountUsd ?? 0,
    percepcionPen: percepcion?.amountPen ?? 0,
    detraccionUsd,
    detraccionPen,
    totalUsd: round2(base.totalUsd + detraccionUsd),
    totalPen: round2(base.totalPen + detraccionPen),
  };
}
