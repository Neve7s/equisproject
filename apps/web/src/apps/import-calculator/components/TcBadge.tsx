import { useState } from "react";
import type { UseExchangeRateResult } from "../../../lib/useExchangeRate";

interface TcBadgeProps {
  tc: UseExchangeRateResult;
}

export function TcBadge({ tc }: TcBadgeProps) {
  const [editing, setEditing] = useState(false);

  if (editing || tc.isManual) {
    return (
      <div className="tc-badge tc-badge-edit">
        <input
          className="tc-badge-input"
          type="text"
          value={tc.manualTc}
          onChange={(e) => tc.setManualTc(e.target.value)}
          placeholder="3.7500"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") { tc.applyManual(); setEditing(false); }
            if (e.key === "Escape") setEditing(false);
          }}
        />
        <button className="tc-badge-btn" onClick={() => { tc.applyManual(); setEditing(false); }}>OK</button>
        {tc.isManual && (
          <button className="tc-badge-btn" onClick={() => { tc.revertManual(); setEditing(false); }}>SUNAT</button>
        )}
        <button className="tc-badge-btn" onClick={() => setEditing(false)}>×</button>
      </div>
    );
  }

  return (
    <div className="tc-badge" title={tc.data ? `${tc.data.source} · ${tc.data.fecha}${tc.data.utc5 ? " · " + tc.data.utc5 + " UTC-5" : ""}` : ""}>
      <span className="tc-badge-label">TC</span>
      {tc.loading ? (
        <span className="skeleton" style={{ width: 52, height: 16, borderRadius: 4 }}>&nbsp;</span>
      ) : (
        <span className="tc-badge-value">{tc.tc > 0 ? tc.tc.toFixed(4) : "—"}</span>
      )}
      <button className="tc-badge-btn" onClick={tc.refresh} disabled={tc.loading} title="Actualizar">↻</button>
      <button className="tc-badge-btn" onClick={() => { tc.setManualTc(""); setEditing(true); }} title="Editar manualmente">✎</button>
    </div>
  );
}
