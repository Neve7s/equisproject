import { useState } from "react";

type Incoterm = {
  code: string;
  name: string;
  transferRisk: string;
  transferCost: string;
  insurance: string;
  export: string;
  import: string;
  group: "E" | "F" | "C" | "D";
};

const incoterms: Incoterm[] = [
  { code: "EXW", name: "Ex Works", transferRisk: "Vendedor", transferCost: "Vendedor", insurance: "Comprador", export: "Comprador", import: "Comprador", group: "E" },
  { code: "FCA", name: "Free Carrier", transferRisk: "Vendedor", transferCost: "Vendedor", insurance: "Comprador", export: "Vendedor", import: "Comprador", group: "F" },
  { code: "FAS", name: "Free Alongside Ship", transferRisk: "Vendedor", transferCost: "Vendedor", insurance: "Comprador", export: "Vendedor", import: "Comprador", group: "F" },
  { code: "FOB", name: "Free On Board", transferRisk: "Vendedor", transferCost: "Vendedor", insurance: "Comprador", export: "Vendedor", import: "Comprador", group: "F" },
  { code: "CFR", name: "Cost and Freight", transferRisk: "Vendedor", transferCost: "Vendedor", insurance: "Comprador", export: "Vendedor", import: "Comprador", group: "C" },
  { code: "CIF", name: "Cost, Insurance & Freight", transferRisk: "Vendedor", transferCost: "Vendedor", insurance: "Vendedor", export: "Vendedor", import: "Comprador", group: "C" },
  { code: "CPT", name: "Carriage Paid To", transferRisk: "Vendedor", transferCost: "Vendedor", insurance: "Comprador", export: "Vendedor", import: "Comprador", group: "C" },
  { code: "CIP", name: "Carriage & Insurance Paid To", transferRisk: "Vendedor", transferCost: "Vendedor", insurance: "Vendedor", export: "Vendedor", import: "Comprador", group: "C" },
  { code: "DAP", name: "Delivered at Place", transferRisk: "Vendedor", transferCost: "Vendedor", insurance: "Vendedor", export: "Vendedor", import: "Comprador", group: "D" },
  { code: "DPU", name: "Delivered at Place Unloaded", transferRisk: "Vendedor", transferCost: "Vendedor", insurance: "Vendedor", export: "Vendedor", import: "Comprador", group: "D" },
  { code: "DDP", name: "Delivered Duty Paid", transferRisk: "Vendedor", transferCost: "Vendedor", insurance: "Vendedor", export: "Vendedor", import: "Vendedor", group: "D" },
];

const groupColors: Record<string, string> = {
  E: "#3B82F6",
  F: "#10B981",
  C: "#F59E0B",
  D: "#EF4444",
};

const groupLabels: Record<string, string> = {
  E: "Inicio",
  F: "Transporte principal no pagado",
  C: "Transporte principal pagado",
  D: "Entrega",
};

export default function IncotermCompare() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filterGroup, setFilterGroup] = useState<string | null>(null);

  const filtered = filterGroup ? incoterms.filter((i) => i.group === filterGroup) : incoterms;
  const selectedTerm = incoterms.find((i) => i.code === selected);

  return (
    <div className="page-header" style={{ paddingBottom: 0 }}>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Comparador de Incoterms</h1>
          <p className="page-subtitle">11 Incoterms® 2020 — differences in risk, cost, and responsibility.</p>
        </div>
      </div>

      <div className="icc-layout">
        <div className="icc-groups">
          <button
            className={`icc-group-btn ${filterGroup === null ? "icc-group-active" : ""}`}
            onClick={() => setFilterGroup(null)}
          >
            Todos
          </button>
          {Object.entries(groupLabels).map(([key, label]) => (
            <button
              key={key}
              className={`icc-group-btn ${filterGroup === key ? "icc-group-active" : ""}`}
              style={filterGroup === key ? { borderColor: groupColors[key], color: groupColors[key] } : {}}
              onClick={() => setFilterGroup(key)}
            >
              {key} — {label}
            </button>
          ))}
        </div>

        <div className="icc-table-wrap">
          <table className="icc-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Riesgo</th>
                <th>Costo</th>
                <th>Seguro</th>
                <th>Export</th>
                <th>Import</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.code}
                  className={`icc-row ${selected === t.code ? "icc-row-selected" : ""}`}
                  onClick={() => setSelected(selected === t.code ? null : t.code)}
                >
                  <td>
                    <span className="icc-code" style={{ background: groupColors[t.group] }}>
                      {t.code}
                    </span>
                  </td>
                  <td className="icc-name">{t.name}</td>
                  <td><span className={`icc-badge ${t.transferRisk === "Vendedor" ? "icc-badge-seller" : "icc-badge-buyer"}`}>{t.transferRisk}</span></td>
                  <td><span className={`icc-badge ${t.transferCost === "Vendedor" ? "icc-badge-seller" : "icc-badge-buyer"}`}>{t.transferCost}</span></td>
                  <td><span className={`icc-badge ${t.insurance === "Vendedor" ? "icc-badge-seller" : "icc-badge-buyer"}`}>{t.insurance}</span></td>
                  <td><span className={`icc-badge ${t.export === "Vendedor" ? "icc-badge-seller" : "icc-badge-buyer"}`}>{t.export}</span></td>
                  <td><span className={`icc-badge ${t.import === "Vendedor" ? "icc-badge-seller" : "icc-badge-buyer"}`}>{t.import}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedTerm && (
          <div className="icc-detail card">
            <div className="calc-card-header">
              <span className="icc-code-lg" style={{ background: groupColors[selectedTerm.group] }}>
                {selectedTerm.code}
              </span>
              <span className="calc-card-label">{selectedTerm.name}</span>
            </div>
            <div className="calc-card-body">
              <div className="icc-detail-grid">
                <div className="icc-detail-item">
                  <span className="icc-detail-label">Grupo</span>
                  <strong>{groupLabels[selectedTerm.group]}</strong>
                </div>
                <div className="icc-detail-item">
                  <span className="icc-detail-label">Riesgo se transfiere</span>
                  <strong>{selectedTerm.transferRisk}</strong>
                </div>
                <div className="icc-detail-item">
                  <span className="icc-detail-label">Costo se transfiere</span>
                  <strong>{selectedTerm.transferCost}</strong>
                </div>
                <div className="icc-detail-item">
                  <span className="icc-detail-label">Seguro</span>
                  <strong>{selectedTerm.insurance}</strong>
                </div>
                <div className="icc-detail-item">
                  <span className="icc-detail-label">Despacho de exportación</span>
                  <strong>{selectedTerm.export}</strong>
                </div>
                <div className="icc-detail-item">
                  <span className="icc-detail-label">Despacho de importación</span>
                  <strong>{selectedTerm.import}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
