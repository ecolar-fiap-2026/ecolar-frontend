import { z } from "zod";
import { isoDate } from "../types/domain";
import { today } from "./energy";

export const decimal = (value: string) =>
  /^\d+(?:[.,]\d+)?$/.test(value.trim())
    ? Number(value.trim().replace(",", "."))
    : NaN;
export const residenceInput = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Use pelo menos 2 caracteres.")
    .max(100, "Use no máximo 100 caracteres."),
  quantidadeMoradores: z
    .number({ error: "Informe um número inteiro positivo." })
    .int("Informe um número inteiro.")
    .min(1, "Informe pelo menos um morador.")
    .max(1000, "Confira a quantidade de moradores."),
  tarifaKwh: z
    .number({ error: "Informe uma tarifa válida, como 0,90." })
    .min(0, "A tarifa não pode ser negativa.")
    .max(100, "Confira a tarifa por kWh."),
});
export const consumptionInput = z.object({
  data: isoDate.refine(
    (value) => value <= today(),
    "O consumo não pode ter data futura.",
  ),
  consumoKwh: z
    .number({ error: "Informe um consumo válido, como 7,5." })
    .min(0, "O consumo não pode ser negativo.")
    .max(1_000_000, "Confira o consumo informado."),
  origem: z.enum(["MANUAL", "IMPORTADO", "SIMULADO"]),
});
export const goalInput = z
  .object({
    dataInicio: isoDate,
    dataFim: isoDate,
    limiteKwh: z
      .number({ error: "Informe um limite válido." })
      .positive("O limite deve ser maior que zero.")
      .max(1_000_000),
  })
  .refine((value) => value.dataFim >= value.dataInicio, {
    path: ["dataFim"],
    message: "O fim não pode ser anterior ao início.",
  });
export function fieldsFrom(error: z.ZodError): Record<string, string> {
  return Object.fromEntries(
    error.issues.map((issue) => [
      String(issue.path[0]),
      issue.code === "invalid_format" && issue.format === "date"
        ? "Informe uma data válida."
        : issue.message,
    ]),
  );
}
export function routeId(raw: string | undefined) {
  return raw && /^[1-9]\d*$/.test(raw) && Number.isSafeInteger(Number(raw))
    ? Number(raw)
    : null;
}
