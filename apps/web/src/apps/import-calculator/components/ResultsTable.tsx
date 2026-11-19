import { useState } from "react";
import { formatMoney, formatRate, type TaxResult, type TaxError } from "@equis/shared";

interface ResultsTableProps {
  result: TaxResult | TaxError;
  tc: number;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Clipboard API no disponible (contexto no seguro): se usa el fallback.
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export function ResultsTable({ result, tc }: ResultsTableProps) {
  const [copied, setCopied] = useState(false);

  if (!result || (result as TaxError).ok === false) {
    return (
      <div className="card calc-card calc-results-card">
        <div className="calc-results-head">
          <div>
            <p className="section-label">Resultado</p>
            <p className="calc-results-subtitle">CIF + tributos aduaneros</p>
          </div>
        </div>
        <div className="results">
          <div className="error-banner" style={{ marginTop: 0 }}>
            {(result as TaxError).message ?? "Tipo de cambio no disponible"}
          </div>
        </div>
      </div>
    );
  }

  const r = result as TaxResult;

  const buildSummary = () =>
    [
      `CIF: ${formatMoney(r.cifUsd, "USD")} / ${formatMoney(r.cifPen, "PEN")}`,
      ...r.lines.map(
        (line) =>
          `${line.label} (${formatRate(line.rate)}): ${formatMoney(line.amountUsd, "USD")} / ${formatMoney(line.amountPen, "PEN")}`,
      ),
      `Total tributos: ${formatMoney(r.totalTaxesUsd, "USD")} / ${formatMoney(r.totalTaxesPen, "PEN")}`,
      `Total desembolso: ${formatMoney(r.totalUsd, "USD")} / ${formatMoney(r.totalPen, "PEN")}`,
      `TC: S/ ${tc.toFixed(4)}`,
    ].join("\n");

  const handleCopy = async () => {
    const ok = await copyText(buildSummary());
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="card calc-card calc-results-card">
      <div className="calc-results-head">
        <div>
          <p className="section-label">Resultado</p>
          <p className="calc-results-subtitle">CIF + tributos aduaneros</p>
        </div>
        <button className="btn btn-ghost btn-sm results-copy" onClick={handleCopy}>
          {copied ? "✓ Copiado" : "⧉ Copiar resumen"}
        </button>
      </div>

      <div className="results">
        <div className="results-cif">
          <span className="results-cif-label">CIF</span>
          <span className="results-cif-value selectable" title="CIF en USD">{formatMoney(r.cifUsd, "USD")}</span>
          <span className="results-cif-pen selectable" title="CIF en PEN">{formatMoney(r.cifPen, "PEN")}</span>
        </div>

        <div className="results-lines">
          {r.lines.map((line) => (
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
          <span>Total tributos</span>
          <span className="results-subtotal-values selectable">
            <span>{formatMoney(r.totalTaxesUsd, "USD")}</span>
            <span className="results-line-pen">{formatMoney(r.totalTaxesPen, "PEN")}</span>
          </span>
        </div>

        <div className="results-total">
          <span className="results-total-label">Total desembolso</span>
          <div className="results-total-values selectable">
            <span className="results-total-main">{formatMoney(r.totalUsd, "USD")}</span>
            <span className="results-total-pen">{formatMoney(r.totalPen, "PEN")}</span>
          </div>
        </div>

        <div className="results-footer">
          TC S/ {tc.toFixed(4)} · CIF + Tributos · selecciona y copia cualquier valor
        </div>
      </div>
    </div>
  );
}
