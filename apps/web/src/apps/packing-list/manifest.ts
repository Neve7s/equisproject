import type { MiniAppManifest } from "../../registry/types";
import PackingList from "./index";

export const packingListManifest: MiniAppManifest = {
  id: "packing-list",
  name: "Packing List",
  tagline: "Lista de empaque PDF",
  description: "Genera una lista de empaque profesional en PDF para exportación e importación.",
  icon: "📦",
  accent: "#F59E0B",
  path: "/apps/packing-list",
  Component: PackingList,
};
