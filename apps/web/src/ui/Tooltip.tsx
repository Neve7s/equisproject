import type { ReactNode } from "react";

interface TooltipProps {
  title: string;
  content: ReactNode;
}

export function Tooltip({ title, content }: TooltipProps) {
  return (
    <span className="tooltip-wrap">
      <button className="tooltip-trigger" aria-label={title}>?</button>
      <div className="tooltip-content" role="tooltip">
        <div className="tooltip-title">{title}</div>
        <div className="tooltip-text">{content}</div>
      </div>
    </span>
  );
}
