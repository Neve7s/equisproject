import type { MiniAppManifest } from "./types";
import { importCalculatorManifest } from "../apps/import-calculator/manifest";
import { qrGeneratorManifest } from "../apps/qr-generator/manifest";
import { unitConverterManifest } from "../apps/unit-converter/manifest";
import { packingListManifest } from "../apps/packing-list/manifest";
import { incotermCompareManifest } from "../apps/incoterm-compare/manifest";

export const miniApps: MiniAppManifest[] = [
  importCalculatorManifest,
  qrGeneratorManifest,
  unitConverterManifest,
  packingListManifest,
  incotermCompareManifest,
];
