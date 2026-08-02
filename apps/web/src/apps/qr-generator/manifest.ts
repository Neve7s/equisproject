import type { MiniAppManifest } from "../../registry/types";
import QrGenerator from "./index";

export const qrGeneratorManifest: MiniAppManifest = {
  id: "qr-generator",
  name: "QR / Barcode",
  tagline: "Códigos con marco",
  description: "Genera códigos QR o de barra con marco personalizado. Exporta en PNG y PDF.",
  icon: "qr",
  accent: "#10B981",
  path: "/apps/qr-generator",
  Component: QrGenerator,
};
