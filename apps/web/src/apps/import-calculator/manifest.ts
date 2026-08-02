import type { MiniAppManifest } from "../../registry/types";
import { ImportCalculator } from "./index";

export const importCalculatorManifest: MiniAppManifest = {
  id: "import-calculator",
  name: "Calculadora de Importación",
  tagline: "Aranceles e impuestos de importación Perú",
  description: "Calcula CIF, IGV, IPM, percepción y demás tributos aduaneros. Tipo de cambio en tiempo real desde la SUNAT.",
  icon: "📦",
  accent: "#43FEA4",
  path: "/apps/import-calculator",
  Component: ImportCalculator,
};
