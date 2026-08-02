import { CURRENCY_SYMBOL } from "@equis/shared";

interface MoneyInputProps {
  label: string;
  currency: "USD" | "PEN";
  value: string;
  onChange: (v: string) => void;
}

export function MoneyInput({ label, currency, value, onChange }: MoneyInputProps) {
  return (
    <div className="calc-field">
      <label className="calc-field-label">{label}</label>
      <div className="calc-field-input">
        <span className="calc-field-prefix">{CURRENCY_SYMBOL[currency]}</span>
        <input
          className="calc-field-value"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
        />
      </div>
    </div>
  );
}
