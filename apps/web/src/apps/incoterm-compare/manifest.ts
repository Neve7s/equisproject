import type { MiniAppManifest } from "../../registry/types";
import IncotermCompare from "./index";

export const incotermCompareManifest: MiniAppManifest = {
  id: "incoterm-compare",
  name: "Comparador Incoterms",
  tagline: "11 Incoterms® 2020",
  description: "Compara riesgos, costos y responsabilidades entre todos los Incoterms® 2020.",
  icon: "🌐",
  accent: "#8B5CF6",
  path: "/apps/incoterm-compare",
  Component: IncotermCompare,
};
