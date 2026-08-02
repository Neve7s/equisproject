import { useState, useRef, useEffect } from "react";
import { INCOTERMS } from "@equis/shared";

interface IncotermSelectProps {
  value: string;
  onChange: (code: string) => void;
}

export function IncotermSelect({ value, onChange }: IncotermSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = INCOTERMS.find((i) => i.code === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="inc-select" ref={ref}>
      <label className="calc-field-label">Incoterm</label>
      <div className="inc-field-wrap">
        <button className="inc-trigger" onClick={() => setOpen(!open)} type="button">
          <span className="inc-trigger-code">{selected?.code}</span>
          <span className="inc-trigger-name">{selected?.name}</span>
          <svg className={`inc-trigger-arrow ${open ? "open" : ""}`} width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {open && (
        <div className="inc-dropdown">
          {INCOTERMS.map((i) => (
            <button
              key={i.code}
              className={`inc-option ${i.code === value ? "inc-option-active" : ""}`}
              onClick={() => { onChange(i.code); setOpen(false); }}
              type="button"
            >
              <span className="inc-option-code">{i.code}</span>
              <div className="inc-option-info">
                <span className="inc-option-name">{i.name}</span>
                <span className="inc-option-detail">{i.description}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
