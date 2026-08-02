import { round2 } from "./currency";
import type { Currency } from "./types";

export const DEFAULT_RATES = {
  adValorem: 0,
  igvAduana: 15.5,
  ipm: 2.5,
  isc: 0,
  percepcion: 3.5,
} as const;

export type TaxRateKey = keyof typeof DEFAULT_RATES;
export type TaxRates = { [K in TaxRateKey]: number };

export const RATE_LABELS: Record<TaxRateKey, string> = {
  adValorem: "Ad Valorem",
  igvAduana: "IGV Aduana",
  ipm: "IPM",
  isc: "ISC",
  percepcion: "Percepción",
};

export const RATE_DESCRIPTIONS: Record<TaxRateKey, string> = {
  adValorem: "Impuesto al valor de la mercancía",
  igvAduana: "16% IGV + 2% IPM sobre el CIF (parcial)",
  ipm: "Impuesto selectivo al consumo",
  isc: "Impuesto selectivo al consumo",
  percepcion: "Percepción al IGV por operaciones con terceros",
};

export interface TaxInput {
  fob: number;
  flete: number;
  seguro: number;
  incoterm: number;
  currency: Currency;
  rates: TaxRates;
  tc: number;
}

export interface TaxLine {
  key: TaxRateKey;
  label: string;
  rate: number;
  amountUsd: number;
  amountPen: number;
}

export interface TaxResult {
  cifUsd: number;
  cifPen: number;
  lines: TaxLine[];
  totalTaxesUsd: number;
  totalTaxesPen: number;
  totalUsd: number;
  totalPen: number;
}

export interface TaxError {
  ok: false;
  message: string;
}

export function normalizeToUsd(value: number, currency: Currency, tc: number): number {
  if (currency === "USD") return value;
  if (tc <= 0) return 0;
  return value / tc;
}

export function computeImportTaxes(input: TaxInput): TaxResult | TaxError {
  if (input.tc <= 0) {
    return { ok: false, message: "Tipo de cambio inválido. Ingrese un tipo de cambio mayor a 0." };
  }

  const safeNumber = (v: unknown): number => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  const fobU = normalizeToUsd(safeNumber(input.fob), input.currency, input.tc);
  const fleteU = normalizeToUsd(safeNumber(input.flete), input.currency, input.tc);
  const seguroU = normalizeToUsd(safeNumber(input.seguro), input.currency, input.tc);
  const incotermU = normalizeToUsd(safeNumber(input.incoterm), input.currency, input.tc);

  const cif = fobU + fleteU + seguroU + incotermU;
  const rates: TaxRates = { ...DEFAULT_RATES, ...input.rates };

  const lines: TaxLine[] = [];
  let total = 0;

  for (const key of Object.keys(DEFAULT_RATES) as TaxRateKey[]) {
    const rateValue = Math.max(0, safeNumber(rates[key]));
    const amount = cif * (rateValue / 100);
    total += amount;
    lines.push({
      key,
      label: RATE_LABELS[key],
      rate: rateValue,
      amountUsd: round2(amount),
      amountPen: round2(amount * input.tc),
    });
  }

  return {
    cifUsd: round2(cif),
    cifPen: round2(cif * input.tc),
    lines,
    totalTaxesUsd: round2(total),
    totalTaxesPen: round2(total * input.tc),
    totalUsd: round2(cif + total),
    totalPen: round2((cif + total) * input.tc),
  };
}
