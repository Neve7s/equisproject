import { jsPDF } from "jspdf";
import { formatMoney, formatRate, type LiquidationResult } from "@equis/shared";

export interface DuaDraftData {
  duaNumber: string;
  date: string;
  importerName: string;
  importerRuc: string;
  origin: string;
  goods: string;
  tariffCode: string;
}

const WATERMARK = "BORRADOR - NO VALIDO PARA SUNAT";

function watermark(pdf: jsPDF, pageW: number, pageH: number) {
  pdf.saveGraphicsState();
  pdf.setGState(pdf.GState({ opacity: 0.12 }));
  pdf.setTextColor(16, 185, 129);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(34);
  pdf.text(WATERMARK, pageW / 2, pageH / 2, { align: "center", angle: 35 });
  pdf.restoreGraphicsState();
}

export function exportLiquidationPdf(result: LiquidationResult, data: DuaDraftData, tc: number) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  watermark(pdf, pageW, pageH);

  let y = 16;
  pdf.setTextColor(17, 24, 39);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);
  pdf.text("LIQUIDACION ADUANERA", pageW / 2, y, { align: "center" });
  y += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  pdf.text("Documento de trabajo - BORRADOR, no valido para SUNAT", pageW / 2, y, { align: "center" });
  y += 10;

  // Datos de la operación
  pdf.setFillColor(248, 250, 252);
  pdf.rect(14, y - 5, pageW - 28, 34, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(55, 65, 81);
  pdf.text("DATOS DE LA OPERACION", 18, y + 1);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(17, 24, 39);
  const left = [
    `DUA (borrador): ${data.duaNumber || "-"}`,
    `Importador: ${data.importerName || "-"}`,
    `RUC: ${data.importerRuc || "-"}`,
  ];
  const right = [
    `Fecha: ${data.date || "-"}`,
    `Origen: ${data.origin || "-"}`,
    `Partida: ${data.tariffCode || "-"}`,
  ];
  left.forEach((line, i) => pdf.text(line, 18, y + 8 + i * 6));
  right.forEach((line, i) => pdf.text(line, pageW / 2 + 4, y + 8 + i * 6));
  y += 34;
  pdf.text(`Mercancia: ${data.goods || "-"}`, 18, y);
  y += 10;

  // Tabla de liquidación
  pdf.setFillColor(236, 253, 245);
  pdf.rect(14, y - 5, pageW - 28, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(6, 95, 70);
  pdf.text("CONCEPTO", 18, y);
  pdf.text("TASA", 105, y, { align: "right" });
  pdf.text("USD", 140, y, { align: "right" });
  pdf.text("PEN", pageW - 18, y, { align: "right" });
  y += 7;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(31, 41, 55);
  pdf.text("CIF", 18, y);
  pdf.text("-", 105, y, { align: "right" });
  pdf.text(formatMoney(result.cifUsd, "USD"), 140, y, { align: "right" });
  pdf.text(formatMoney(result.cifPen, "PEN"), pageW - 18, y, { align: "right" });
  y += 6;

  result.lines.forEach((line) => {
    if (y > 205) {
      pdf.addPage();
      watermark(pdf, pageW, pageH);
      y = 18;
    }
    pdf.text(line.label, 18, y);
    pdf.text(formatRate(line.rate), 105, y, { align: "right" });
    pdf.text(formatMoney(line.amountUsd, "USD"), 140, y, { align: "right" });
    pdf.text(formatMoney(line.amountPen, "PEN"), pageW - 18, y, { align: "right" });
    y += 6;
  });

  y += 2;
  pdf.setDrawColor(209, 213, 219);
  pdf.line(14, y, pageW - 14, y);
  y += 7;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(6, 95, 70);
  pdf.text("TOTAL A PAGAR", 18, y);
  pdf.text(formatMoney(result.totalUsd, "USD"), 140, y, { align: "right" });
  pdf.text(formatMoney(result.totalPen, "PEN"), pageW - 18, y, { align: "right" });
  y += 8;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text(`TC SUNAT de referencia: S/ ${tc.toFixed(4)}`, 18, y);
  y += 12;

  // Borrador de DUA
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(31, 41, 55);
  pdf.text("BORRADOR DE DUA (NO VALIDO PARA SUNAT)", 14, y);
  y += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  const fields = [
    `Declaracion: ${data.duaNumber || "________________"}`,
    `Fecha: ${data.date || "________________"}`,
    `Importador / RUC: ${data.importerName || "________________"} / ${data.importerRuc || "____________"}`,
    `Pais de origen: ${data.origin || "________________"}`,
    `Mercancia: ${data.goods || "________________"}`,
    `Partida arancelaria: ${data.tariffCode || "________________"}`,
    `Valor CIF: ${formatMoney(result.cifUsd, "USD")}`,
    `Tributos + percepcion + detraccion: ${formatMoney(result.totalUsd - result.cifUsd, "USD")}`,
  ];
  fields.forEach((line) => {
    if (y > 270) {
      pdf.addPage();
      watermark(pdf, pageW, pageH);
      y = 18;
    }
    pdf.text(line, 18, y);
    y += 6;
  });

  pdf.setFontSize(7.5);
  pdf.setTextColor(107, 114, 128);
  pdf.text("Generado con equisproject.online - WhatsApp +51 935 533 845", pageW / 2, pageH - 10, { align: "center" });

  pdf.save(`liquidacion-dua-${data.duaNumber || "borrador"}.pdf`);
}
