import { useState } from "react";

type Category = "peso" | "volumen" | "longitud" | "temperatura";

interface UnitDef {
  name: string;
  short: string;
  factor: number;
}

const categories: Record<Category, { label: string; units: UnitDef[] }> = {
  peso: {
    label: "Peso",
    units: [
      { name: "Kilogramo", short: "kg", factor: 1 },
      { name: "Libra", short: "lb", factor: 0.453592 },
      { name: "Tonelada", short: "t", factor: 1000 },
      { name: "Onza", short: "oz", factor: 0.0283495 },
    ],
  },
  volumen: {
    label: "Volumen",
    units: [
      { name: "Metro cúbico", short: "m³", factor: 1 },
      { name: "Litro", short: "L", factor: 0.001 },
      { name: "Galón (US)", short: "gal", factor: 0.00378541 },
      { name: "Pies cúbicos", short: "ft³", factor: 0.0283168 },
      { name: "Centímetro cúbico", short: "cm³", factor: 0.000001 },
    ],
  },
  longitud: {
    label: "Longitud",
    units: [
      { name: "Metro", short: "m", factor: 1 },
      { name: "Pulgada", short: "in", factor: 0.0254 },
      { name: "Pie", short: "ft", factor: 0.3048 },
      { name: "Yarda", short: "yd", factor: 0.9144 },
      { name: "Centímetro", short: "cm", factor: 0.01 },
    ],
  },
  temperatura: {
    label: "Temperatura",
    units: [
      { name: "Celsius", short: "°C", factor: 0 },
      { name: "Fahrenheit", short: "°F", factor: 0 },
      { name: "Kelvin", short: "K", factor: 0 },
    ],
  },
};

function convertTemp(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === "°C") celsius = value;
  else if (from === "°F") celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  if (to === "°C") return celsius;
  if (to === "°F") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("peso");
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("kg");
  const [toUnit, setToUnit] = useState("lb");

  const cat = categories[category];
  const numVal = parseFloat(inputValue) || 0;

  function convert(): number {
    if (category === "temperatura") {
      return convertTemp(numVal, fromUnit, toUnit);
    }
    const fromFactor = cat.units.find((u) => u.short === fromUnit)!.factor;
    const toFactor = cat.units.find((u) => u.short === toUnit)!.factor;
    return (numVal * fromFactor) / toFactor;
  }

  const result = convert();

  function swap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  return (
    <div className="page-header" style={{ paddingBottom: 0 }}>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Conversor de Unidades</h1>
          <p className="page-subtitle">Peso, volumen, longitud y temperatura para logística.</p>
        </div>
      </div>

      <div className="conv-layout">
        <div className="conv-categories">
          {(Object.keys(categories) as Category[]).map((key) => {
            const cat = categories[key];
            return (
            <button
              key={key}
              className={`conv-cat-btn ${category === key ? "conv-cat-active" : ""}`}
              onClick={() => {
                setCategory(key);
                setFromUnit(cat.units[0]!.short);
                setToUnit(cat.units[1]!.short);
              }}
            >
              {cat.label}
            </button>
            );
          })}
        </div>

        <div className="conv-card card">
          <div className="calc-card-body">
            <div className="conv-row">
              <div className="conv-field">
                <label className="conv-field-label">Cantidad</label>
                <div className="calc-field-input">
                  <input
                    type="number"
                    className="calc-field-value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="conv-field">
                <label className="conv-field-label">De</label>
                <select
                  className="select"
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                >
                  {cat.units.map((u) => (
                    <option key={u.short} value={u.short}>
                      {u.name} ({u.short})
                    </option>
                  ))}
                </select>
              </div>

              <button className="conv-swap" onClick={swap} title="Intercambiar">
                ⇄
              </button>

              <div className="conv-field">
                <label className="conv-field-label">A</label>
                <select
                  className="select"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                >
                  {cat.units.map((u) => (
                    <option key={u.short} value={u.short}>
                      {u.name} ({u.short})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="conv-result card">
          <div className="calc-card-body" style={{ textAlign: "center" }}>
            <div className="conv-result-value">
              {numVal} {fromUnit}
            </div>
            <div className="conv-result-equals">=</div>
            <div className="conv-result-output">
              {result.toFixed(6).replace(/\.?0+$/, "")} {toUnit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
