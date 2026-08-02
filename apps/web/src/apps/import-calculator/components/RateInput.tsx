import { RATE_LABELS, type TaxRateKey } from "@equis/shared";

interface RateInputProps {
  label: TaxRateKey;
  value: number;
  defaultValue: number;
  onChange: (v: string) => void;
  onReset: () => void;
}

export function RateInput({ label, value, defaultValue, onChange, onReset }: RateInputProps) {
  const isDefault = value === defaultValue;
  return (
    <div className="rate-chip">
      <span className="rate-chip-label">{RATE_LABELS[label]}</span>
      <div className="rate-chip-input">
        <input
          className="rate-chip-value"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="rate-chip-pct">%</span>
        {!isDefault && (
          <button className="rate-chip-reset" onClick={onReset} title={`Restablecer ${defaultValue}%`}>↺</button>
        )}
      </div>
    </div>
  );
}
