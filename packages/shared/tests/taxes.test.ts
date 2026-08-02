import { describe, expect, it } from "bun:test";
import { computeImportTaxes, DEFAULT_RATES } from "../src/taxes";

describe("computeImportTaxes", () => {
  const baseInput = {
    fob: 1000,
    flete: 100,
    seguro: 0,
    incoterm: 0,
    currency: "USD" as const,
    rates: { ...DEFAULT_RATES },
    tc: 3.75,
  };

  it("calculates CIF correctly", () => {
    const result = computeImportTaxes(baseInput);
    if (result.ok === false) throw new Error("Expected ok");
    expect(result.cifUsd).toBe(1100);
    expect(result.cifPen).toBe(4125);
  });

  it("applies default tax rates", () => {
    const result = computeImportTaxes(baseInput);
    if (result.ok === false) throw new Error("Expected ok");
    // IGV Aduana: 15.5% of 1100 = 170.5
    const igvLine = result.lines.find((l) => l.key === "igvAduana");
    expect(igvLine?.amountUsd).toBe(170.5);
    expect(igvLine?.amountPen).toBe(639.38);
    // IPM: 2.5% of 1100 = 27.5
    const ipmLine = result.lines.find((l) => l.key === "ipm");
    expect(ipmLine?.amountUsd).toBe(27.5);
    expect(ipmLine?.amountPen).toBe(103.13);
    // Percepción: 3.5% of 1100 = 38.5
    const perLine = result.lines.find((l) => l.key === "percepcion");
    expect(perLine?.amountUsd).toBe(38.5);
    expect(perLine?.amountPen).toBe(144.38);
  });

  it("sum totals correctly", () => {
    const result = computeImportTaxes(baseInput);
    if (result.ok === false) throw new Error("Expected ok");
    // Total taxes = 170.5 + 27.5 + 0 + 0 + 38.5 = 236.5
    expect(result.totalTaxesUsd).toBe(236.5);
    expect(result.totalTaxesPen).toBe(886.88);
    // Total disbursement = 1100 + 236.5 = 1336.5
    expect(result.totalUsd).toBe(1336.5);
    expect(result.totalPen).toBe(5011.88);
  });

  it("handles PEN input correctly", () => {
    const result = computeImportTaxes({
      ...baseInput,
      fob: 3750,
      flete: 375,
      currency: "PEN",
    });
    if (result.ok === false) throw new Error("Expected ok");
    expect(result.cifUsd).toBe(1100);
    expect(result.cifPen).toBe(4125);
  });

  it("applies custom rates", () => {
    const result = computeImportTaxes({
      ...baseInput,
      rates: { ...DEFAULT_RATES, adValorem: 4, isc: 3.2 },
    });
    if (result.ok === false) throw new Error("Expected ok");
    const advLine = result.lines.find((l) => l.key === "adValorem");
    expect(advLine?.amountUsd).toBe(44); // 4% of 1100
    const iscLine = result.lines.find((l) => l.key === "isc");
    expect(iscLine?.amountUsd).toBe(35.2); // 3.2% of 1100
  });

  it("returns error when tc is zero", () => {
    const result = computeImportTaxes({ ...baseInput, tc: 0 });
    expect(result.ok).toBe(false);
  });

  it("returns error when tc is negative", () => {
    const result = computeImportTaxes({ ...baseInput, tc: -1 });
    expect(result.ok).toBe(false);
  });

  it("handles zero inputs", () => {
    const result = computeImportTaxes({
      ...baseInput,
      fob: 0,
      flete: 0,
      seguro: 0,
      incoterm: 0,
    });
    if (result.ok === false) throw new Error("Expected ok");
    expect(result.cifUsd).toBe(0);
    expect(result.totalTaxesUsd).toBe(0);
    expect(result.totalUsd).toBe(0);
  });

  it("clamps negative inputs to zero", () => {
    const result = computeImportTaxes({
      ...baseInput,
      fob: -100,
      flete: 0,
    });
    if (result.ok === false) throw new Error("Expected ok");
    expect(result.cifUsd).toBe(0);
  });

  it("includes incoterm in CIF", () => {
    const result = computeImportTaxes({
      ...baseInput,
      incoterm: 200,
    });
    if (result.ok === false) throw new Error("Expected ok");
    expect(result.cifUsd).toBe(1300);
    expect(result.totalUsd).toBe(1579.5);
  });

  it("rounds amounts to 2 decimal places", () => {
    const result = computeImportTaxes({
      ...baseInput,
      fob: 1234.56,
      flete: 789.12,
      seguro: 45.67,
      incoterm: 12.34,
      tc: 3.75,
    });
    if (result.ok === false) throw new Error("Expected ok");
    for (const line of result.lines) {
      expect(line.amountUsd).toBeCloseTo(line.amountUsd, 2);
      expect(line.amountPen).toBeCloseTo(line.amountPen, 2);
    }
  });
});
