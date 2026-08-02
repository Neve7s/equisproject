import type { MiniAppManifest } from "./types";
import { importCalculatorManifest } from "../apps/import-calculator/manifest";
import { qrGeneratorManifest } from "../apps/qr-generator/manifest";

export const miniApps: MiniAppManifest[] = [
  importCalculatorManifest,
  qrGeneratorManifest,
];
