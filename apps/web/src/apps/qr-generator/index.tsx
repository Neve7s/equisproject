import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

export default function QrGenerator() {
  const [text, setText] = useState("https://equisproject.onrender.com");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [frameStyle, setFrameStyle] = useState<"none" | "simple" | "modern" | "gradient">("modern");
  const [frameLabel, setFrameLabel] = useState("equisproject");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text) return;
    QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: "H",
    }).then(setQrDataUrl);
  }, [text, fgColor, bgColor]);

  function drawFramedQr(canvas: HTMLCanvasElement, size: number) {
    const ctx = canvas.getContext("2d")!;
    canvas.width = size;
    canvas.height = size;
    const pad = size * 0.06;
    const qrSize = size - pad * 2;

    if (frameStyle === "none") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      const img = new Image();
      img.src = qrDataUrl;
      ctx.drawImage(img, pad, pad, qrSize, qrSize);
      return;
    }

    if (frameStyle === "simple") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = size * 0.008;
      const r = size * 0.03;
      roundRect(ctx, pad * 0.5, pad * 0.5, size - pad, size - pad, r);
      ctx.stroke();
      const img = new Image();
      img.src = qrDataUrl;
      ctx.drawImage(img, pad, pad, qrSize, qrSize);
      if (frameLabel) {
        ctx.fillStyle = fgColor;
        ctx.font = `bold ${size * 0.045}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(frameLabel, size / 2, size - pad * 0.6);
      }
      return;
    }

    if (frameStyle === "modern") {
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, "#8B5CF6");
      grad.addColorStop(0.5, "#EC4899");
      grad.addColorStop(1, "#F59E0B");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = bgColor;
      const r = size * 0.04;
      roundRect(ctx, pad * 0.4, pad * 0.4, size - pad * 0.8, size - pad * 0.8, r);
      ctx.fill();

      const img = new Image();
      img.src = qrDataUrl;
      ctx.drawImage(img, pad, pad, qrSize, qrSize);

      if (frameLabel) {
        ctx.fillStyle = "#1F2937";
        ctx.font = `bold ${size * 0.042}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(frameLabel, size / 2, size - pad * 0.65);
      }
      return;
    }

    if (frameStyle === "gradient") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      const img = new Image();
      img.src = qrDataUrl;
      ctx.drawImage(img, pad, pad, qrSize, qrSize);

      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, "rgba(139,92,246,0.15)");
      grad.addColorStop(1, "rgba(236,72,153,0.15)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      if (frameLabel) {
        ctx.fillStyle = fgColor;
        ctx.font = `bold ${size * 0.042}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(frameLabel, size / 2, size - pad * 0.6);
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
    link.download = "qr-code.png";
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
    const imgSize = Math.min(pageW, pageH) * 0.65;
    const x = (pageW - imgSize) / 2;
    const y = (pageH - imgSize) / 2 - 10;

    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, pageW, pageH, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(31, 41, 55);
    pdf.text("QR Code", pageW / 2, y - 12, { align: "center" });

    pdf.addImage(imgData, "PNG", x, y, imgSize, imgSize);

    if (frameLabel) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(107, 114, 128);
      pdf.text(frameLabel, pageW / 2, y + imgSize + 10, { align: "center" });
    }

    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text("Generated by equisproject", pageW / 2, pageH - 10, { align: "center" });

    pdf.save("qr-code.pdf");
  }

  return (
    <div className="page-header" style={{ paddingBottom: 0 }}>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Generador QR</h1>
          <p className="page-subtitle">Genera códigos QR con marco. Exporta en PNG y PDF.</p>
        </div>
      </div>

      <div className="qr-layout">
        <div className="qr-controls">
          <div className="calc-card card">
            <div className="calc-card-header">
              <span className="calc-card-label">Contenido</span>
            </div>
            <div className="calc-card-body">
              <textarea
                className="qr-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="URL, texto, email, teléfono..."
                rows={3}
              />
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
            <button className="btn btn-primary" onClick={exportPng} disabled={!qrDataUrl}>
              Exportar PNG
            </button>
            <button className="btn btn-ghost" onClick={exportPdf} disabled={!qrDataUrl}>
              Exportar PDF
            </button>
          </div>
        </div>

        <div className="qr-preview-wrap">
          <div className="qr-preview card">
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="qr-preview-img" />
            ) : (
              <div className="qr-preview-empty">Escribe algo para generar el QR</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
