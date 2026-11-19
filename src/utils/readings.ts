import { isoDate } from "../types/domain";
import { dayCount } from "./energy";

export function readingDifference(
  previous: number,
  current: number,
  start: string,
  end: string,
) {
  if (
    !Number.isFinite(previous) ||
    !Number.isFinite(current) ||
    previous < 0 ||
    current < 0
  )
    throw new Error("Informe duas leituras válidas, sem separador de milhar.");
  if (
    !isoDate.safeParse(start).success ||
    !isoDate.safeParse(end).success ||
    start >= end
  )
    throw new Error(
      "A leitura atual precisa ser de uma data posterior à anterior.",
    );
  if (current < previous)
    throw new Error(
      "A leitura atual não pode ser menor. Confira os valores; troca ou reinício de medidor exige outra forma de apuração.",
    );
  const days = dayCount(start, end) - 1;
  return {
    kwh: Number((current - previous).toFixed(3)),
    days,
    daily: days === 1,
  };
}
