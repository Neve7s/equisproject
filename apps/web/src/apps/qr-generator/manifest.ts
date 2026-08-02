import type { MiniAppManifest } from "../../registry/types";
import QrGenerator from "./index";

export const qrGeneratorManifest: MiniAppManifest = {
  id: "qr-generator",
  name: "Generador QR",
  tagline: "Códigos QR con marco",
  description: "Genera códigos QR con marco personalizable. Exporta en PNG y PDF con diseño profesional.",
  icon: "📱",
  accent: "#8B5CF6",
  path: "/apps/qr-generator",
  Component: QrGenerator,
};
