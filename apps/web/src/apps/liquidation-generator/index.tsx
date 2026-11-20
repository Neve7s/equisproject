import { useMemo, useState, useCallback } from "react";
import {
  DEFAULT_RATES,
  RATE_LABELS,
  computeLiquidation,
  isLiquidationError,
  formatMoney,
  formatRate,
  parseAmount,
} from "@equis/shared";
import { useExchangeRate } from "../../lib/useExchangeRate";
import { TcBadge } from "../import-calculator/components/TcBadge";
import { MoneyInput } from "../import-calculator/components/MoneyInput";
import { IncotermSelect } from "../import-calculator/components/IncotermSelect";
import { exportLiquidationPdf } from "./pdf";

export default function LiquidationGenerator() {
  const tc = useExchangeRate();
  const [currency, setCurrency] = useState<"USD" | "PEN">("USD");
  const [fob, setFob] = useState("54300");
  const [flete, setFlete] = useState("6400");
  const [seguro, setSeguro] = useState("100");
  const [incotermCode, setIncotermCode] = useState("EXW");
  const [incotermValue, setIncotermValue] = useState("450");
  const [detraccion, setDetraccion] = useState("0");

  // Datos de ejemplo — nunca datos reales de clientes.
  const [duaNumber, setDuaNumber] = useState("DUA-2026-000123");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [importerName, setImporterName] = useState("Importadora Ejemplo S.A.C.");
  const [importerRuc, setImporterRuc] = useState("20123456789");
  const [origin, setOrigin] = useState("China");
  const [goods, setGoods] = useState("Maquinaria - descripcion de ejemplo");
  const [tariffCode, setTariffCode] = useState("8471.30.00");
  const [copied, setCopied] = useState(false);

  const rawResult = useMemo(
    () =>
      computeLiquidation({
        fob: parseAmount(fob),
        flete: parseAmount(flete),
        seguro: parseAmount(seguro),
        incoterm: parseAmount(incotermValue),
        currency,
        rates: { ...DEFAULT_RATES },
        tc: tc.tc,
        detraccionRate: parseAmount(detraccion),
      }),
    [fob, flete, seguro, incotermValue, currency, detraccion, tc.tc]
  );

  const calcError = rawResult && isLiquidationError(rawResult) ? rawResult.message : null;
  const liquidation = rawResult && !isLiquidationError(rawResult) ? rawResult : null;

  const handlePdf = useCallback(() => {
    if (!liquidation) return;
    exportLiquidationPdf(
      liquidation,
      { duaNumber, date, importerName, importerRuc, origin, goods, tariffCode },
      tc.tc
    );
  }, [liquidation, duaNumber, date, importerName, importerRuc, origin, goods, tariffCode, tc.tc]);

  const handleCopy = useCallback(async () => {
    if (!liquidation) return;
    const text = [
      `LIQUIDACION ADUANERA (borrador) - ${duaNumber}`,
      `CIF: ${formatMoney(liquidation.cifUsd, "USD")} / ${formatMoney(liquidation.cifPen, "PEN")}`,
      ...liquidation.lines.map(
        (l) => `${l.label} (${formatRate(l.rate)}): ${formatMoney(l.amountUsd, "USD")} / ${formatMoney(l.amountPen, "PEN")}`
      ),
      `TOTAL: ${formatMoney(liquidation.totalUsd, "USD")} / ${formatMoney(liquidation.totalPen, "PEN")}`,
      `TC: S/ ${tc.tc.toFixed(4)}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [liquidation, duaNumber, tc.tc]);

  return (
    <>
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Liquidación Aduanera y DUA</h1>
            <p className="page-subtitle">Borrador de trabajo · CIF + tributos + detracción</p>
          </div>
        </div>
      </header>

      <div className="calc-layout calc-layout-stacked">
        <div className="error-banner liq-warning">
          <strong>Borrador informativo.</strong> No es una declaración aduanera ni un documento válido para SUNAT.
          Las tasas de detracción dependen de tu operación: confírmalas con tu contador.
        </div>

        <div className="card calc-card calc-workbench">
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

          <div className="calc-workbench-grid">
            <section className="calc-panel" aria-labelledby="liq-calc-title">
              <div className="calc-panel-head">
                <p className="section-label" id="liq-calc-title">Cálculo</p>
                <span className="calc-panel-hint">en {currency}</span>
              </div>
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
                <div className="calc-field">
                  <label className="calc-field-label" htmlFor="liq-detraccion">Detracción</label>
                  <div className="calc-field-input">
                    <input
                      id="liq-detraccion"
                      className="calc-field-value"
                      type="text"
                      inputMode="decimal"
                      value={detraccion}
                      onChange={(e) => setDetraccion(e.target.value)}
                      placeholder="0"
                    />
                    <span className="calc-field-prefix" style={{ marginLeft: 6 }}>%</span>
                  </div>
                </div>
              </div>
              <div className="liq-rate-chips">
                {(Object.keys(DEFAULT_RATES) as (keyof typeof DEFAULT_RATES)[]).map((key) => (
                  <span key={key} className="mono">{RATE_LABELS[key]} {DEFAULT_RATES[key]}%</span>
                ))}
              </div>
            </section>

            <section className="calc-panel calc-panel-tax" aria-labelledby="liq-data-title">
              <div className="calc-panel-head">
                <p className="section-label" id="liq-data-title">Datos para el borrador de DUA</p>
              </div>
              <div className="liq-fields-grid">
                <label className="liq-field"><span>N° DUA (borrador)</span><input value={duaNumber} onChange={(e) => setDuaNumber(e.target.value)} /></label>
                <label className="liq-field"><span>Fecha</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
                <label className="liq-field"><span>Importador (ejemplo)</span><input value={importerName} onChange={(e) => setImporterName(e.target.value)} /></label>
                <label className="liq-field"><span>RUC (ejemplo)</span><input value={importerRuc} onChange={(e) => setImporterRuc(e.target.value)} /></label>
                <label className="liq-field"><span>País de origen</span><input value={origin} onChange={(e) => setOrigin(e.target.value)} /></label>
                <label className="liq-field"><span>Partida arancelaria</span><input value={tariffCode} onChange={(e) => setTariffCode(e.target.value)} /></label>
                <label className="liq-field liq-field-wide"><span>Mercancía</span><input value={goods} onChange={(e) => setGoods(e.target.value)} /></label>
              </div>
            </section>
          </div>
        </div>

        <section className="calc-results" aria-label="Liquidación">
          <div className="card calc-card calc-results-card">
            <div className="calc-results-head">
              <div>
                <p className="section-label">Liquidación</p>
                <p className="calc-results-subtitle">CIF + tributos + percepción + detracción</p>
              </div>
              <div className="liq-actions">
                <button className="btn btn-ghost btn-sm results-copy" onClick={handleCopy}>
                  {copied ? "✓ Copiado" : "⧉ Copiar"}
                </button>
                <button className="btn btn-ghost btn-sm results-copy" onClick={handlePdf}>↓ Descargar PDF</button>
              </div>
            </div>
            <div className="results">
              {calcError ? (
                <div className="error-banner" style={{ marginTop: 0 }}>
                  {calcError}
                </div>
              ) : (
                liquidation && (
                <>
                  <div className="results-cif">
                    <span className="results-cif-label">CIF</span>
                    <span className="results-cif-value selectable">{formatMoney(liquidation.cifUsd, "USD")}</span>
                    <span className="results-cif-pen selectable">{formatMoney(liquidation.cifPen, "PEN")}</span>
                  </div>
                  <div className="results-lines">
                    {liquidation.lines.map((line) => (
                      <div key={line.key} className="results-line">
                        <span className="results-line-label">
                          {line.label}
                          <span className="results-line-rate">{formatRate(line.rate)}</span>
                        </span>
                        <span className="results-line-values selectable">
                          <span>{formatMoney(line.amountUsd, "USD")}</span>
                          <span className="results-line-pen">{formatMoney(line.amountPen, "PEN")}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="results-subtotal">
                    <span>Total tributos + detracción</span>
                    <span className="results-subtotal-values selectable">
                      <span>{formatMoney(liquidation.totalTaxesUsd + liquidation.detraccionUsd, "USD")}</span>
                      <span className="results-line-pen">{formatMoney(liquidation.totalTaxesPen + liquidation.detraccionPen, "PEN")}</span>
                    </span>
                  </div>
                  <div className="results-total">
                    <span className="results-total-label">Total a pagar</span>
                    <div className="results-total-values selectable">
                      <span className="results-total-main">{formatMoney(liquidation.totalUsd, "USD")}</span>
                      <span className="results-total-pen">{formatMoney(liquidation.totalPen, "PEN")}</span>
                    </div>
                  </div>
                  <div className="results-footer">
                    Borrador · percepción {formatMoney(liquidation.percepcionUsd, "USD")} · detracción {formatMoney(liquidation.detraccionUsd, "USD")} · TC S/ {tc.tc.toFixed(4)}
                  </div>
                </>
                )
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
