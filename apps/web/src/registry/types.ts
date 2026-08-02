import type { ComponentType } from "react";

export interface MiniAppManifest {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accent: string;
  path: string;
  Component: ComponentType;
}
