import { describe, expect, it } from "bun:test";
import { DEFAULT_RATES } from "../src/taxes";
import { computeLiquidation } from "../src/liquidacion";

const baseInput = {
  fob: 1000,
  flete: 100,
  seguro: 0,
  incoterm: 0,
  currency: "USD" as const,
  rates: { ...DEFAULT_RATES },
  tc: 3.75,
  detraccionRate: 10,
};

describe("computeLiquidation", () => {
  it("adds detracción on top of CIF + tributos", () => {
    const r = computeLiquidation(baseInput);
    if (r.ok === false) throw new Error("Expected ok");
    expect(r.cifUsd).toBe(1100);
    expect(r.detraccionUsd).toBe(110);
    expect(r.detraccionPen).toBe(412.5);
    // Base total was 1336.5; +110 detracción = 1446.5
    expect(r.totalUsd).toBe(1446.5);
    expect(r.totalPen).toBe(5424.38);
  });

  it("includes a detracción line with rate 0 when not applicable", () => {
    const r = computeLiquidation({ ...baseInput, detraccionRate: 0 });
    if (r.ok === false) throw new Error("Expected ok");
    const line = r.lines.find((l) => l.key === "detraccion");
    expect(line).toBeDefined();
    expect(line?.rate).toBe(0);
    expect(line?.amountUsd).toBe(0);
    expect(r.totalUsd).toBe(1336.5);
  });

  it("does not duplicate percepción", () => {
    const r = computeLiquidation(baseInput);
    if (r.ok === false) throw new Error("Expected ok");
    expect(r.lines.filter((l) => l.key === "percepcion")).toHaveLength(1);
    expect(r.percepcionUsd).toBe(38.5);
  });

  it("rejects an invalid exchange rate", () => {
    const r = computeLiquidation({ ...baseInput, tc: 0 });
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.message).toContain("Tipo de cambio");
  });

  it("normalizes PEN input before computing", () => {
    const r = computeLiquidation({
      ...baseInput,
      fob: 3750,
      flete: 375,
      currency: "PEN",
    });
    if (r.ok === false) throw new Error("Expected ok");
    expect(r.cifUsd).toBe(1100);
    expect(r.totalUsd).toBe(1446.5);
  });
});
