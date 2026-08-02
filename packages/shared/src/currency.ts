import type { Currency } from "./types";

export const CURRENCY_SYMBOL: Record<Currency, string> = { USD: "$", PEN: "S/" };

export function formatMoney(value: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "es-PE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatRate(value: number): string {
  return `${new Intl.NumberFormat("es-PE", { maximumFractionDigits: 2 }).format(value)}%`;
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function parseAmount(input: string): number {
  const s = input.trim().replace(/\s/g, "");
  if (!s) return 0;
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma === -1 && lastDot === -1) {
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }
  let normalized = s;
  if (lastComma > lastDot) {
    normalized = s.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > lastComma) {
    normalized = s.replace(/,/g, "");
  }
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}
