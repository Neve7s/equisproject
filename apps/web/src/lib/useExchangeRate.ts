import { useState, useEffect, useCallback } from "react";
import { loadExchangeRate, type TcData } from "./exchange-rate";

export interface UseExchangeRateResult {
  tc: number;
  data: TcData | null;
  loading: boolean;
  error: string | null;
  manualTc: string;
  isManual: boolean;
  refresh: () => void;
  setManualTc: (v: string) => void;
  applyManual: () => void;
  revertManual: () => void;
}

const MANUAL_KEY = "equis.tc.manual";

function loadManual(): string {
  try {
    return localStorage.getItem(MANUAL_KEY) ?? "";
  } catch {
    return "";
  }
}

function saveManual(v: string): void {
  try {
    if (v) localStorage.setItem(MANUAL_KEY, v);
    else localStorage.removeItem(MANUAL_KEY);
  } catch { /* */ }
}

export function useExchangeRate(): UseExchangeRateResult {
  const [tc, setTc] = useState(0);
  const [data, setData] = useState<TcData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualTc, setManualTc] = useState(loadManual);
  const [isManual, setIsManual] = useState(() => loadManual() !== "");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadExchangeRate();
      if (result) {
        setData(result.data);
        if (!isManual) setTc(result.tc);
      } else {
        setError("No se pudo obtener el tipo de cambio de SUNAT. Ingrese uno manualmente.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al obtener tipo de cambio");
    } finally {
      setLoading(false);
    }
  }, [isManual]);

  useEffect(() => {
    if (isManual && manualTc) {
      const n = Number(manualTc.replace(",", "."));
      if (Number.isFinite(n) && n > 0) {
        setTc(n);
        setLoading(false);
        return;
      }
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(() => {
    if (!isManual) load();
  }, [isManual, load]);

  const applyManual = useCallback(() => {
    const n = Number(manualTc.replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) return;
    setTc(n);
    setIsManual(true);
    saveManual(manualTc);
  }, [manualTc]);

  const revertManual = useCallback(() => {
    setIsManual(false);
    setManualTc("");
    saveManual("");
    load();
  }, [load]);

  return { tc, data, loading, error, manualTc, isManual, refresh, setManualTc, applyManual, revertManual };
}
