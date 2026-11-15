import { z } from "zod";

const id = z.number().int().positive();
export const isoDate = z.iso.date();
export const residenceSchema = z.object({
  id,
  nome: z.string().min(1),
  quantidadeMoradores: z.number().int().positive(),
  tarifaKwh: z.number().nonnegative(),
});
export const consumptionSchema = z.object({
  id,
  residenciaId: id,
  data: isoDate,
  consumoKwh: z.number().nonnegative(),
  origem: z.enum(["MANUAL", "IMPORTADO", "SIMULADO"]),
});
export const goalSchema = z.object({
  id,
  residenciaId: id,
  dataInicio: isoDate,
  dataFim: isoDate,
  limiteKwh: z.number().positive(),
});
export const predictionSchema = z.object({
  dataAlvo: isoDate,
  consumoPrevistoKwh: z.number().nonnegative(),
  modelo: z.string().min(1),
});
export const patternSchema = z.object({
  dataInicio: isoDate,
  dataFim: isoDate,
  grupo: z.union([z.string(), z.number()]),
  interpretacao: z.string().min(1),
  modelo: z.string().min(1),
});

export type Residence = z.infer<typeof residenceSchema>;
export type Consumption = z.infer<typeof consumptionSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type Prediction = z.infer<typeof predictionSchema>;
export type Pattern = z.infer<typeof patternSchema>;
export type ResidenceInput = Omit<Residence, "id">;
export type ConsumptionInput = Omit<Consumption, "id" | "residenciaId">;
export type GoalInput = Omit<Goal, "id" | "residenciaId">;
export type FieldErrors = Record<string, string>;
