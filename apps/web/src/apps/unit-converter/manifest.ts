import type { MiniAppManifest } from "../../registry/types";
import UnitConverter from "./index";

export const unitConverterManifest: MiniAppManifest = {
  id: "unit-converter",
  name: "Conversor de Unidades",
  tagline: "Peso, volumen, longitud",
  description: "Convierte entre unidades de peso, volumen, longitud y temperatura para operaciones de envío.",
  icon: "freight",
  accent: "#10B981",
  path: "/apps/unit-converter",
  Component: UnitConverter,
};
