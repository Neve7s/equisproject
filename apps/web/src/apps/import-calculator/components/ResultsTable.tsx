import { formatMoney, formatRate, type TaxResult, type TaxError } from "@equis/shared";

interface ResultsTableProps {
  result: TaxResult | TaxError;
  tc: number;
}

export function ResultsTable({ result, tc }: ResultsTableProps) {
  if (!result || (result as TaxError).ok === false) {
    return (
      <div className="error-banner" style={{ marginTop: 0 }}>
        {(result as TaxError).message ?? "Tipo de cambio no disponible"}
      </div>
    );
  }

  const r = result as TaxResult;

  return (
    <div className="results">
      <div className="results-cif">
        <span className="results-cif-label">CIF</span>
        <span className="results-cif-value">{formatMoney(r.cifUsd, "USD")}</span>
        <span className="results-cif-pen">{formatMoney(r.cifPen, "PEN")}</span>
      </div>

      <div className="results-lines">
        {r.lines.map((line) => (
          <div key={line.key} className="results-line">
            <span className="results-line-label">
              {line.label}
              <span className="results-line-rate">{formatRate(line.rate)}</span>
            </span>
            <span className="results-line-values">
              <span>{formatMoney(line.amountUsd, "USD")}</span>
              <span className="results-line-pen">{formatMoney(line.amountPen, "PEN")}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="results-subtotal">
        <span>Total tributos</span>
        <span className="results-subtotal-values">
          <span>{formatMoney(r.totalTaxesUsd, "USD")}</span>
          <span className="results-line-pen">{formatMoney(r.totalTaxesPen, "PEN")}</span>
        </span>
      </div>

      <div className="results-total">
        <span className="results-total-label">Total desembolso</span>
        <div className="results-total-values">
          <span className="results-total-main">{formatMoney(r.totalUsd, "USD")}</span>
          <span className="results-total-pen">{formatMoney(r.totalPen, "PEN")}</span>
        </div>
      </div>

      <div className="results-footer">
        TC S/ {tc.toFixed(4)} · CIF + Tributos
      </div>
    </div>
  );
}
