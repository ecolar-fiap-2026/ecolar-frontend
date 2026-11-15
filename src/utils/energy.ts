import type { Consumption, Goal } from "../types/domain";

export const number = (value: number, digits = 2) =>
  value.toLocaleString("pt-BR", { maximumFractionDigits: digits });
export const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const dateLabel = (value: string) =>
  value.split("-").reverse().join("/");
export function today() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function dayCount(start: string, end: string) {
  return Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000) + 1;
}
export function summary(records: Consumption[], start: string, end: string) {
  const filtered = records
    .filter((record) => record.data >= start && record.data <= end)
    .sort((a, b) => a.data.localeCompare(b.data));
  const total = filtered.reduce((sum, record) => sum + record.consumoKwh, 0);
  const days = new Set(filtered.map((record) => record.data)).size;
  return {
    records: filtered,
    total,
    days,
    expectedDays: dayCount(start, end),
    average: days ? total / days : null,
  };
}
export function goalSummary(records: Consumption[], goal: Goal) {
  const result = summary(records, goal.dataInicio, goal.dataFim);
  const status = !result.days
    ? "Sem registros"
    : result.total > goal.limiteKwh
      ? "Limite ultrapassado"
      : result.days < result.expectedDays
        ? "Período parcial"
        : result.total === goal.limiteKwh
          ? "No limite"
          : "Dentro do limite";
  return {
    ...result,
    status,
    percentage: Math.min(100, (result.total / goal.limiteKwh) * 100),
  };
}
export function simulate(
  watts: number,
  hours: number,
  quantity: number,
  days: number,
  tariff: number,
) {
  const kwh = (watts / 1000) * hours * quantity * days;
  return { kwh, cost: kwh * tariff };
}
