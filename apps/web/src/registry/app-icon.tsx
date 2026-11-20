import type { SVGProps, ReactElement } from "react";

type IconProps = SVGProps<SVGSVGElement> & { name: string };

const icons: Record<string, (color: string) => (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  calculator: (color) => (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10.01" />
      <line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  ),
  qr: (color) => (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="3" height="3" />
      <line x1="21" y1="14" x2="21" y2="14.01" />
      <line x1="14" y1="21" x2="14" y2="21.01" />
      <line x1="21" y1="21" x2="21" y2="21.01" />
    </svg>
  ),
  converter: (color) => (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 4l3 3-3 3" />
      <path d="M7 21l-3-3 3-3" />
      <path d="M20 7H4" />
      <path d="M20 17H4" />
    </svg>
  ),
  package: (color) => (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16.5 9.4l-9-5.19" />
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  globe: (color) => (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  customs: (color) => (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 2h9l5 5v15H5z" />
      <path d="M14 2v5h5" />
      <path d="M8.5 11h7M8.5 14h5" />
      <circle cx="16" cy="17" r="3.5" />
      <path d="M14.3 17l1.2 1.2 2.2-2.4" />
    </svg>
  ),
  freight: (color) => (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="6" width="13" height="10" rx="1.5" />
      <path d="M14 10h4l4 4v2h-8z" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 18h8M4 9h7" />
    </svg>
  ),
  container: (color) => (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="6" width="20" height="12" rx="1.5" />
      <path d="M2 10h20M2 14h20M9 6v12M16 6v12" />
    </svg>
  ),
  receipt: (color) => (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 2h14v20l-3-2-4 2-4-2-3 2z" />
      <path d="M9 7h6M9 11h6M9 15h3" />
      <circle cx="16.5" cy="15.5" r="2.5" />
    </svg>
  ),
};

export function AppIcon({ name, color = "currentColor", ...props }: IconProps) {
  const factory = icons[name];
  if (!factory) return null;
  const Icon = factory(color);
  return <Icon {...props} />;
}
