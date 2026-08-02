import type { MiniAppManifest } from "../../registry/types";
import { ImportCalculator } from "./index";

export const importCalculatorManifest: MiniAppManifest = {
  id: "import-calculator",
  name: "Calculadora de Importación",
  tagline: "CIF + Impuestos",
  description: "Calcula impuestos y costos totales de importación en Perú.",
  icon: "calculator",
  accent: "#43FEA4",
  path: "/apps/import-calculator",
  Component: ImportCalculator,
};
