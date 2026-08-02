import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";

type CodeType = "qr" | "barcode";
type FrameStyle = "none" | "simple" | "modern" | "gradient";

const barcodeFormats = [
  { value: "CODE128", label: "CODE 128" },
  { value: "EAN13", label: "EAN-13" },
  { value: "EAN8", label: "EAN-8" },
  { value: "UPC", label: "UPC" },
  { value: "CODE39", label: "CODE 39" },
  { value: "ITF14", label: "ITF-14" },
];

export default function QrGenerator() {
  const [codeType, setCodeType] = useState<CodeType>("qr");
  const [text, setText] = useState("https://equisproject.onrender.com");
  const [barcodeFormat, setBarcodeFormat] = useState("CODE128");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [barcodeDataUrl, setBarcodeDataUrl] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("modern");
  const [frameLabel, setFrameLabel] = useState("equisproject");
  const barcodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (codeType !== "qr" || !text) return;
    QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: "H",
    }).then(setQrDataUrl);
  }, [text, fgColor, bgColor, codeType]);

  useEffect(() => {
    if (codeType !== "barcode" || !text || !barcodeRef.current) return;
    try {
      JsBarcode(barcodeRef.current, text, {
        format: barcodeFormat,
        width: 2,
        height: 80,
        displayValue: true,
        background: bgColor,
        lineColor: fgColor,
        margin: 10,
        font: "monospace",
        fontSize: 14,
      });
      setBarcodeDataUrl(barcodeRef.current.toDataURL("image/png"));
    } catch {
      setBarcodeDataUrl("");
    }
  }, [text, fgColor, bgColor, codeType, barcodeFormat]);

  const previewUrl = codeType === "qr" ? qrDataUrl : barcodeDataUrl;

  function drawFramedQr(canvas: HTMLCanvasElement, size: number) {
    const ctx = canvas.getContext("2d")!;
    canvas.width = size;
    canvas.height = codeType === "barcode" ? size * 0.5 : size;
    const cw = canvas.width;
    const ch = canvas.height;
    const pad = size * 0.04;

    if (frameStyle === "none") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, cw, ch);
      if (codeType === "qr") {
        const img = new Image();
        img.src = qrDataUrl;
        const qrSize = Math.min(cw, ch) - pad * 2;
        ctx.drawImage(img, (cw - qrSize) / 2, (ch - qrSize) / 2, qrSize, qrSize);
      } else {
        const img = new Image();
        img.src = barcodeDataUrl;
        const bw = cw - pad * 2;
        ctx.drawImage(img, pad, pad, bw, ch - pad * 2);
      }
      return;
    }

    if (frameStyle === "simple") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, cw, ch);
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = size * 0.006;
      const r = size * 0.03;
      roundRect(ctx, pad * 0.4, pad * 0.4, cw - pad * 0.8, ch - pad * 0.8, r);
      ctx.stroke();
      if (codeType === "qr") {
        const img = new Image();
        img.src = qrDataUrl;
        const qrSize = Math.min(cw, ch) - pad * 2.5;
        ctx.drawImage(img, (cw - qrSize) / 2, (ch - qrSize) / 2 - size * 0.02, qrSize, qrSize);
      } else {
        const img = new Image();
        img.src = barcodeDataUrl;
        const bw = cw - pad * 2.5;
        ctx.drawImage(img, (cw - bw) / 2, pad * 1.2, bw, ch - pad * 3);
      }
      if (frameLabel) {
        ctx.fillStyle = fgColor;
        ctx.font = `bold ${size * 0.04}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(frameLabel, cw / 2, ch - pad * 0.6);
      }
      return;
    }

    if (frameStyle === "modern") {
      const grad = ctx.createLinearGradient(0, 0, cw, ch);
      grad.addColorStop(0, "#8B5CF6");
      grad.addColorStop(0.5, "#EC4899");
      grad.addColorStop(1, "#F59E0B");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = bgColor;
      const r = size * 0.035;
      roundRect(ctx, pad * 0.4, pad * 0.4, cw - pad * 0.8, ch - pad * 0.8, r);
      ctx.fill();
      if (codeType === "qr") {
        const img = new Image();
        img.src = qrDataUrl;
        const qrSize = Math.min(cw, ch) - pad * 2.5;
        ctx.drawImage(img, (cw - qrSize) / 2, (ch - qrSize) / 2 - size * 0.02, qrSize, qrSize);
      } else {
        const img = new Image();
        img.src = barcodeDataUrl;
        const bw = cw - pad * 2.5;
        ctx.drawImage(img, (cw - bw) / 2, pad * 1.2, bw, ch - pad * 3);
      }
      if (frameLabel) {
        ctx.fillStyle = "#1F2937";
        ctx.font = `bold ${size * 0.038}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(frameLabel, cw / 2, ch - pad * 0.55);
      }
      return;
    }

    if (frameStyle === "gradient") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, cw, ch);
      if (codeType === "qr") {
        const img = new Image();
        img.src = qrDataUrl;
        const qrSize = Math.min(cw, ch) - pad * 2;
        ctx.drawImage(img, (cw - qrSize) / 2, (ch - qrSize) / 2 - size * 0.02, qrSize, qrSize);
      } else {
        const img = new Image();
        img.src = barcodeDataUrl;
        const bw = cw - pad * 2;
        ctx.drawImage(img, (cw - bw) / 2, pad * 1.2, bw, ch - pad * 3);
      }
      const grad = ctx.createLinearGradient(0, 0, cw, ch);
      grad.addColorStop(0, "rgba(139,92,246,0.12)");
      grad.addColorStop(1, "rgba(236,72,153,0.12)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);
      if (frameLabel) {
        ctx.fillStyle = fgColor;
        ctx.font = `bold ${size * 0.038}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(frameLabel, cw / 2, ch - pad * 0.55);
      }
    }
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function exportPng() {
    const canvas = document.createElement("canvas");
    drawFramedQr(canvas, 1024);
    const link = document.createElement("a");
    link.download = codeType === "qr" ? "qr-code.png" : "barcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function exportPdf() {
    const canvas = document.createElement("canvas");
    drawFramedQr(canvas, 1024);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const isBarcode = codeType === "barcode";
    const imgW = isBarcode ? pageW * 0.8 : Math.min(pageW, pageH) * 0.65;
    const imgH = isBarcode ? imgW * 0.35 : imgW;
    const x = (pageW - imgW) / 2;
    const y = (pageH - imgH) / 2 - 10;

    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, pageW, pageH, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(31, 41, 55);
    pdf.text(isBarcode ? "Barcode" : "QR Code", pageW / 2, y - 12, { align: "center" });

    pdf.addImage(imgData, "PNG", x, y, imgW, imgH);

    if (frameLabel) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(107, 114, 128);
      pdf.text(frameLabel, pageW / 2, y + imgH + 10, { align: "center" });
    }

    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text("Generated by equisproject", pageW / 2, pageH - 10, { align: "center" });

    pdf.save(isBarcode ? "barcode.pdf" : "qr-code.pdf");
  }

  return (
    <div className="page-header" style={{ paddingBottom: 0 }}>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Generador QR / Barcode</h1>
          <p className="page-subtitle">Genera códigos QR o de barra con marco. Exporta en PNG y PDF.</p>
        </div>
      </div>

      <div className="qr-layout">
        <div className="qr-controls">
          <div className="calc-card card">
            <div className="calc-card-header">
              <span className="calc-card-label">Tipo de código</span>
            </div>
            <div className="calc-card-body">
              <div className="qr-type-toggle">
                <button
                  className={`qr-type-btn ${codeType === "qr" ? "qr-type-active" : ""}`}
                  onClick={() => setCodeType("qr")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><line x1="21" y1="14" x2="21" y2="14.01"/><line x1="14" y1="21" x2="14" y2="21.01"/><line x1="21" y1="21" x2="21" y2="21.01"/></svg>
                  QR
                </button>
                <button
                  className={`qr-type-btn ${codeType === "barcode" ? "qr-type-active" : ""}`}
                  onClick={() => setCodeType("barcode")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4h2v16H2"/><path d="M6 4h1v16H6"/><path d="M10 4h2v16h-2"/><path d="M15 4h1v16h-1"/><path d="M19 4h3v16h-3"/></svg>
                  Barcode
                </button>
              </div>
            </div>
          </div>

          <div className="calc-card card">
            <div className="calc-card-header">
              <span className="calc-card-label">Contenido</span>
            </div>
            <div className="calc-card-body">
              <textarea
                className="qr-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={codeType === "qr" ? "URL, texto, email, teléfono..." : "Código numérico (1234567890)"}
                rows={2}
              />
              {codeType === "barcode" && (
                <div style={{ marginTop: 8 }}>
                  <label className="input-label" style={{ marginBottom: 6 }}>Formato</label>
                  <select
                    className="select"
                    value={barcodeFormat}
                    onChange={(e) => setBarcodeFormat(e.target.value)}
                  >
                    {barcodeFormats.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="calc-card card">
            <div className="calc-card-header">
              <span className="calc-card-label">Colores</span>
            </div>
            <div className="calc-card-body">
              <div className="qr-colors">
                <label className="qr-color-label">
                  <span>Color</span>
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                </label>
                <label className="qr-color-label">
                  <span>Fondo</span>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                </label>
              </div>
            </div>
          </div>

          <div className="calc-card card">
            <div className="calc-card-header">
              <span className="calc-card-label">Marco</span>
            </div>
            <div className="calc-card-body">
              <div className="qr-frames">
                {(["none", "simple", "modern", "gradient"] as const).map((s) => (
                  <button
                    key={s}
                    className={`qr-frame-btn ${frameStyle === s ? "qr-frame-active" : ""}`}
                    onClick={() => setFrameStyle(s)}
                  >
                    {s === "none" ? "Sin marco" : s === "simple" ? "Simple" : s === "modern" ? "Gradiente" : "Sutil"}
                  </button>
                ))}
              </div>
              {frameStyle !== "none" && (
                <input
                  className="qr-label-input"
                  value={frameLabel}
                  onChange={(e) => setFrameLabel(e.target.value)}
                  placeholder="Etiqueta (opcional)"
                />
              )}
            </div>
          </div>

          <div className="qr-export-row">
            <button className="btn btn-primary" onClick={exportPng} disabled={!previewUrl}>
              Exportar PNG
            </button>
            <button className="btn btn-ghost" onClick={exportPdf} disabled={!previewUrl}>
              Exportar PDF
            </button>
          </div>
        </div>

        <div className="qr-preview-wrap">
          <div className="qr-preview card">
            <canvas ref={barcodeRef} style={{ display: "none" }} />
            {previewUrl ? (
              <img src={previewUrl} alt={codeType === "qr" ? "QR Code" : "Barcode"} className="qr-preview-img" />
            ) : (
              <div className="qr-preview-empty">Escribe algo para generar el código</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
