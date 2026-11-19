import { describe, expect, it } from "vitest";
import { consumptionCsv, recentPeriod } from "../src/utils/history";
import type { Consumption } from "../src/types/domain";

describe("Histórico do morador", () => {
  it("conta sete dias incluindo hoje ao mudar o ano", () => expect(recentPeriod("2026-01-03", 7)).toEqual({ start: "2025-12-28", end: "2026-01-03" }));
  it("considera 29 de fevereiro", () => expect(recentPeriod("2024-03-01", 3).start).toBe("2024-02-28"));
  it("rejeita datas inexistentes", () => expect(() => recentPeriod("2026-02-30", 7)).toThrow());
  it("exporta ordem cronológica sem inventar dias ausentes ou perder zero", () => {
    const data: Consumption[] = [{ id: 2, residenciaId: 1, data: "2026-11-03", consumoKwh: 0, origem: "MANUAL" }, { id: 1, residenciaId: 1, data: "2026-11-01", consumoKwh: 7.5, origem: "SIMULADO" }];
    expect(consumptionCsv(data)).toBe("\uFEFFData;Consumo (kWh);Origem\r\n2026-11-01;7,5;SIMULADO\r\n2026-11-03;0;MANUAL");
    expect(data[0].id).toBe(2);
  });
});
