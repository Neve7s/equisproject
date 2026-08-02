const CACHE_PREFIX = "equis.tc.";

export interface TcData {
  compra: number;
  venta: number;
  fecha: string;
  source: string;
  utc5?: string;
}

function todayISO(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "America/Lima" });
}

function getCachedTc(date: string): TcData | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + date);
    if (!raw) return null;
    return JSON.parse(raw) as TcData;
  } catch {
    return null;
  }
}

function setCachedTc(date: string, data: TcData): void {
  try {
    localStorage.setItem(CACHE_PREFIX + date, JSON.stringify(data));
  } catch { /* */ }
}

export async function fetchSunatTc(): Promise<TcData> {
  const baseUrl = (import.meta.env.VITE_EXCHANGE_RATE_API_URL as string | undefined)
    ?? "http://localhost:3001/api/exchange-rate";
  const res = await fetch(baseUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json() as Record<string, unknown>;
  if (json.error) throw new Error(String(json.error));
  return {
    compra: Number(json.compra) || 0,
    venta: Number(json.venta) || 0,
    fecha: String(json.fecha ?? todayISO()),
    source: String(json.source ?? "SUNAT"),
    utc5: json.utc5 ? String(json.utc5) : undefined,
  };
}

export function highestTc(data: TcData): number {
  return Math.max(data.compra, data.venta);
}

export async function loadExchangeRate(): Promise<{ data: TcData; tc: number } | null> {
  const today = todayISO();
  const todayCached = getCachedTc(today);
  if (todayCached) {
    return { data: todayCached, tc: highestTc(todayCached) };
  }
  try {
    const fresh = await fetchSunatTc();
    setCachedTc(today, fresh);
    return { data: fresh, tc: highestTc(fresh) };
  } catch {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX));
    const allCached = keys
      .map((k) => { try { return JSON.parse(localStorage.getItem(k)!) as TcData; } catch { return null; } })
      .filter((d): d is TcData => d !== null)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    if (allCached.length > 0) {
      return { data: allCached[0]!, tc: highestTc(allCached[0]!) };
    }
    return null;
  }
}
