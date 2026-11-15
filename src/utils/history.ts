import type { Consumption } from "../types/domain";
import { isoDate } from "../types/domain";

export function recentPeriod(end: string, days: number) {
  if (!isoDate.safeParse(end).success || !Number.isInteger(days) || days < 1)
    throw new Error("Período inválido.");
  const date = new Date(`${end}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days + 1);
  return { start: date.toISOString().slice(0, 10), end };
}

export function consumptionCsv(records: Consumption[]) {
  const lines = [...records]
    .sort((a, b) => a.data.localeCompare(b.data))
    .map((record) =>
      [
        record.data,
        String(record.consumoKwh).replace(".", ","),
        record.origem,
      ].join(";"),
    );
  return "\uFEFFData;Consumo (kWh);Origem\r\n" + lines.join("\r\n");
}
