import type { MiniAppManifest } from "../../registry/types";
import LiquidationGenerator from "./index";

export const liquidationManifest: MiniAppManifest = {
  id: "liquidacion-dua",
  name: "Liquidación Aduanera y DUA",
  tagline: "Liquidación + borrador PDF",
  description: "Desglosa CIF, tributos, percepción y detracción. Descarga una liquidación y un borrador de DUA en PDF.",
  icon: "receipt",
  accent: "#34D399",
  path: "/apps/liquidacion-dua",
  Component: LiquidationGenerator,
};
