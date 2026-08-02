import { useState } from "react";
import { jsPDF } from "jspdf";

interface PackingItem {
  id: number;
  description: string;
  quantity: number;
  netWeight: number;
  grossWeight: number;
  length: number;
  width: number;
  height: number;
}

let nextId = 1;

function emptyItem(): PackingItem {
  return {
    id: nextId++,
    description: "",
    quantity: 1,
    netWeight: 0,
    grossWeight: 0,
    length: 0,
    width: 0,
    height: 0,
  };
}

function calcCbm(item: PackingItem): number {
  return (item.length * item.width * item.height * item.quantity) / 1000000;
}

export default function PackingList() {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [items, setItems] = useState<PackingItem[]>([emptyItem()]);

  function addItem() {
    setItems([...items, emptyItem()]);
  }

  function removeItem(id: number) {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  }

  function updateItem(id: number, field: keyof PackingItem, value: string | number) {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  const totals = items.reduce(
    (acc, i) => ({
      qty: acc.qty + i.quantity,
      net: acc.net + i.netWeight * i.quantity,
      gross: acc.gross + i.grossWeight * i.quantity,
      cbm: acc.cbm + calcCbm(i),
    }),
    { qty: 0, net: 0, gross: 0, cbm: 0 }
  );

  function exportPdf() {
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    let y = 15;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(31, 41, 55);
    pdf.text("PACKING LIST", pageW / 2, y, { align: "center" });
    y += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(107, 114, 128);

    if (invoiceNo) {
      pdf.text(`Invoice No: ${invoiceNo}`, 15, y);
    }
    pdf.text(`Date: ${date}`, pageW - 15, y, { align: "right" });
    y += 6;

    if (origin || destination) {
      if (origin) pdf.text(`Origin: ${origin}`, 15, y);
      if (destination) pdf.text(`Destination: ${destination}`, pageW / 2, y);
      y += 8;
    }

    const cols = [15, 30, 90, 105, 120, 137, 155, 175, 200];
    const headers = ["#", "Description", "Qty", "Net Wt", "Gross Wt", "L", "W", "H", "CBM"];

    pdf.setFillColor(248, 250, 252);
    pdf.rect(15, y, pageW - 30, 8, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(55, 65, 81);
    headers.forEach((h, i) => {
      if (cols[i] !== undefined) pdf.text(h, cols[i]!, y + 5.5);
    });
    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(31, 41, 55);

    items.forEach((item, idx) => {
      if (y > 180) {
        pdf.addPage();
        y = 15;
      }
      pdf.text(String(idx + 1), cols[0]!, y + 5);
      pdf.text(item.description || "-", cols[1]!, y + 5);
      pdf.text(String(item.quantity), cols[2]!, y + 5);
      pdf.text(`${item.netWeight} kg`, cols[3]!, y + 5);
      pdf.text(`${item.grossWeight} kg`, cols[4]!, y + 5);
      pdf.text(`${item.length}`, cols[5]!, y + 5);
      pdf.text(`${item.width}`, cols[6]!, y + 5);
      pdf.text(`${item.height}`, cols[7]!, y + 5);
      pdf.text(calcCbm(item).toFixed(4), cols[8]!, y + 5);
      y += 7;
    });

    y += 2;
    pdf.setDrawColor(209, 213, 219);
    pdf.line(15, y, pageW - 15, y);
    y += 7;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text("TOTALS", cols[1]!, y);
    pdf.text(String(totals.qty), cols[2]!, y);
    pdf.text(`${totals.net.toFixed(2)} kg`, cols[3]!, y);
    pdf.text(`${totals.gross.toFixed(2)} kg`, cols[4]!, y);
    pdf.text(`${totals.cbm.toFixed(4)} m³`, cols[8]!, y);

    pdf.save(`packing-list-${invoiceNo || date}.pdf`);
  }

  return (
    <div className="page-header" style={{ paddingBottom: 0 }}>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Packing List</h1>
          <p className="page-subtitle">Genera lista de empaque en PDF para exportación.</p>
        </div>
      </div>

      <div className="pl-layout">
        <div className="pl-form">
          <div className="calc-card card">
            <div className="calc-card-header">
              <span className="calc-card-label">Información del envío</span>
            </div>
            <div className="calc-card-body">
              <div className="pl-info-grid">
                <div className="calc-field">
                  <span className="calc-field-label">No. Factura</span>
                  <div className="calc-field-input">
                    <input className="calc-field-value" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} placeholder="INV-001" />
                  </div>
                </div>
                <div className="calc-field">
                  <span className="calc-field-label">Fecha</span>
                  <div className="calc-field-input">
                    <input className="calc-field-value" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                </div>
                <div className="calc-field">
                  <span className="calc-field-label">Origen</span>
                  <div className="calc-field-input">
                    <input className="calc-field-value" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Lima, Perú" />
                  </div>
                </div>
                <div className="calc-field">
                  <span className="calc-field-label">Destino</span>
                  <div className="calc-field-input">
                    <input className="calc-field-value" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Miami, USA" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="calc-card card">
            <div className="calc-card-header">
              <span className="calc-card-label">Items</span>
              <button className="btn btn-ghost btn-sm" onClick={addItem}>+ Agregar</button>
            </div>
            <div className="calc-card-body">
              <div className="pl-items">
                {items.map((item, idx) => (
                  <div key={item.id} className="pl-item">
                    <div className="pl-item-header">
                      <span className="pl-item-num">#{idx + 1}</span>
                      {items.length > 1 && (
                        <button className="btn btn-ghost btn-sm" onClick={() => removeItem(item.id)}>✕</button>
                      )}
                    </div>
                    <div className="pl-item-fields">
                      <input
                        className="pl-item-desc"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        placeholder="Descripción del producto"
                      />
                      <div className="pl-item-nums">
                        <div className="pl-num-field">
                          <span>Cant.</span>
                          <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value) || 1)} />
                        </div>
                        <div className="pl-num-field">
                          <span>Peso Neto (kg)</span>
                          <input type="number" step="0.01" value={item.netWeight || ""} onChange={(e) => updateItem(item.id, "netWeight", Number(e.target.value))} />
                        </div>
                        <div className="pl-num-field">
                          <span>Peso Bruto (kg)</span>
                          <input type="number" step="0.01" value={item.grossWeight || ""} onChange={(e) => updateItem(item.id, "grossWeight", Number(e.target.value))} />
                        </div>
                        <div className="pl-num-field">
                          <span>L (cm)</span>
                          <input type="number" step="0.1" value={item.length || ""} onChange={(e) => updateItem(item.id, "length", Number(e.target.value))} />
                        </div>
                        <div className="pl-num-field">
                          <span>W (cm)</span>
                          <input type="number" step="0.1" value={item.width || ""} onChange={(e) => updateItem(item.id, "width", Number(e.target.value))} />
                        </div>
                        <div className="pl-num-field">
                          <span>H (cm)</span>
                          <input type="number" step="0.1" value={item.height || ""} onChange={(e) => updateItem(item.id, "height", Number(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={exportPdf} style={{ width: "100%" }}>
            Exportar PDF
          </button>
        </div>

        <div className="pl-totals card">
          <div className="calc-card-header">
            <span className="calc-card-label">Resumen</span>
          </div>
          <div className="calc-card-body">
            <div className="pl-summary-row">
              <span>Total Items</span>
              <strong>{items.length}</strong>
            </div>
            <div className="pl-summary-row">
              <span>Total Cantidad</span>
              <strong>{totals.qty}</strong>
            </div>
            <div className="pl-summary-row">
              <span>Peso Neto</span>
              <strong>{totals.net.toFixed(2)} kg</strong>
            </div>
            <div className="pl-summary-row">
              <span>Peso Bruto</span>
              <strong>{totals.gross.toFixed(2)} kg</strong>
            </div>
            <div className="pl-summary-row pl-summary-accent">
              <span>Volumen Total</span>
              <strong>{totals.cbm.toFixed(4)} m³</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
