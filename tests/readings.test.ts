import { describe, expect, it } from "vitest";
import { readingDifference } from "../src/utils/readings";

describe("Leituras do medidor", () => {
  it("calcula um dia entre meses diferentes", () => expect(readingDifference(1000, 1007.5, "2026-10-31", "2026-11-01")).toEqual({ kwh: 7.5, days: 1, daily: true }));
  it("não transforma um intervalo mensal em registro diário", () => expect(readingDifference(1000, 1100, "2026-10-01", "2026-11-01")).toEqual({ kwh: 100, days: 31, daily: false }));
  it("preserva consumo zero efetivamente medido", () => expect(readingDifference(10, 10, "2026-11-01", "2026-11-02").kwh).toBe(0));
  it("arredonda o resultado para três casas sem ruído binário", () => expect(readingDifference(0.1, 0.3, "2026-11-01", "2026-11-02").kwh).toBe(0.2));
  it("rejeita redução do acumulado", () => expect(() => readingDifference(100, 90, "2026-11-01", "2026-11-02")).toThrow("menor"));
  it.each([NaN, Infinity, -1])("rejeita leitura inválida: %s", value => expect(() => readingDifference(value, 100, "2026-11-01", "2026-11-02")).toThrow("válidas"));
  it.each([["2026-02-30", "2026-03-01"], ["2026-11-02", "2026-11-02"], ["2026-11-03", "2026-11-02"]])("rejeita intervalo inválido: %s a %s", (start, end) => expect(() => readingDifference(10, 20, start, end)).toThrow("data posterior"));
});
