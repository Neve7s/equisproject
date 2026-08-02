import { useState, useMemo } from "react";
import {
  DEFAULT_RATES,
  type TaxRates,
  type TaxRateKey,
  computeImportTaxes,
  parseAmount,
  formatMoney,
  formatRate,
} from "@equis/shared";
import { INCOTERMS } from "@equis/shared";
import { useExchangeRate } from "../../lib/useExchangeRate";
import { TcBadge } from "./components/TcBadge";
import { MoneyInput } from "./components/MoneyInput";
import { RateInput } from "./components/RateInput";
import { ResultsTable } from "./components/ResultsTable";
import { IncotermSelect } from "./components/IncotermSelect";

export function ImportCalculator() {
  const tc = useExchangeRate();
  const [fob, setFob] = useState("1000");
  const [flete, setFlete] = useState("0");
  const [seguro, setSeguro] = useState("0");
  const [incotermCode, setIncotermCode] = useState("FOB");
  const [incotermValue, setIncotermValue] = useState("0");
  const [rates, setRates] = useState<TaxRates>({ ...DEFAULT_RATES });
  const [currency, setCurrency] = useState<"USD" | "PEN">("USD");

  const result = useMemo(() => {
    return computeImportTaxes({
      fob: parseAmount(fob),
      flete: parseAmount(flete),
      seguro: parseAmount(seguro),
      incoterm: parseAmount(incotermValue),
      currency,
      rates,
      tc: tc.tc,
    });
  }, [fob, flete, seguro, incotermValue, currency, rates, tc.tc]);

  const handleRateChange = (key: TaxRateKey, value: string) => {
    const n = parseFloat(value);
    setRates((prev) => ({
      ...prev,
      [key]: Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0,
    }));
  };

  const resetRates = () => setRates({ ...DEFAULT_RATES });
  const resetRate = (key: TaxRateKey) => setRates((prev) => ({ ...prev, [key]: DEFAULT_RATES[key] }));

  return (
    <>
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Calculadora de Importación</h1>
            <p className="page-subtitle">Perú · SUNAT · CIF + tributos aduaneros</p>
          </div>
          <div className="tooltip-wrap">
            <button className="tooltip-trigger" aria-label="¿Cómo funciona?">?</button>
            <div className="tooltip-content">
              <p className="tooltip-title">¿Cómo se calcula?</p>
              <div className="tooltip-text">
                <p><strong>CIF</strong> = FOB + Flete + Seguro + Cargo Incoterm</p>
                <p style={{ marginTop: 8 }}>Sobre el CIF se aplican los tributos:</p>
                <p>• Ad Valorem (sobre valor aduanero)</p>
                <p>• IGV Aduana (15.5% del CIF)</p>
                <p>• IPM (2.5% del CIF)</p>
                <p>• ISC (según tabla SUNAT)</p>
                <p>• Percepción (3.5% del CIF)</p>
                <p style={{ marginTop: 8, color: "var(--text-muted)" }}>Total = CIF + Tributos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="calc-layout">
        <div className="calc-form">
          {tc.error && !tc.isManual && (
            <div className="error-banner">{tc.error}</div>
          )}

          <div className="card calc-card">
            <div className="calc-card-header">
              <div className="calc-card-row">
                <span className="calc-card-label">Moneda</span>
                <div className="currency-toggle">
                  <button
                    className={`currency-pill ${currency === "USD" ? "currency-pill-active" : ""}`}
                    onClick={() => setCurrency("USD")}
                  >USD</button>
                  <button
                    className={`currency-pill ${currency === "PEN" ? "currency-pill-active" : ""}`}
                    onClick={() => setCurrency("PEN")}
                  >PEN</button>
                </div>
                <div style={{ flex: 1 }} />
                <TcBadge tc={tc} />
              </div>
            </div>

            <div className="calc-card-body">
              <p className="section-label">Datos del envío</p>
              <div className="calc-fields">
                <MoneyInput label="FOB" currency={currency} value={fob} onChange={setFob} />
                <MoneyInput label="Flete" currency={currency} value={flete} onChange={setFlete} />
                <MoneyInput label="Seguro" currency={currency} value={seguro} onChange={setSeguro} />
                <div className="calc-incoterm-row">
                  <IncotermSelect value={incotermCode} onChange={setIncotermCode} />
                  <div className="calc-incoterm-cargo">
                    <MoneyInput label="Cargo" currency={currency} value={incotermValue} onChange={setIncotermValue} />
                  </div>
                </div>
              </div>
            </div>

            <div className="calc-card-body" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="calc-rates-header">
                <p className="section-label" style={{ margin: 0 }}>Tributos</p>
                <button className="btn btn-ghost btn-sm" onClick={resetRates}>Restablecer</button>
              </div>
              <div className="calc-rates-grid">
                {(Object.keys(DEFAULT_RATES) as TaxRateKey[]).map((key) => (
                  <RateInput
                    key={key}
                    label={key}
                    value={rates[key]}
                    defaultValue={DEFAULT_RATES[key]}
                    onChange={(v) => handleRateChange(key, v)}
                    onReset={() => resetRate(key)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="calc-results">
          <div className="card calc-card" style={{ position: "sticky", top: 24 }}>
            <div className="calc-card-body">
              <p className="section-label">Resultado</p>
            </div>
            <ResultsTable result={result} tc={tc.tc} />
          </div>
        </div>
      </div>
    </>
  );
}
