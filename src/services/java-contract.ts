import { z } from "zod";
import {
  isoDate,
  residenceSchema,
  consumptionSchema,
  goalSchema,
  predictionSchema,
  patternSchema,
} from "../types/domain";

// JSON real do Java -> nomes das telas. Tipos/datas são validados antes da conversão.
const id = z.number().int().positive();
export const javaResidence = z
  .object({
    cdResidencia: id,
    nmResidencia: z.string().min(1),
    qtMoradores: z.number().int().positive(),
    vlTarifaKwh: z.number().nonnegative(),
  })
  .transform((r) => ({
    id: r.cdResidencia,
    nome: r.nmResidencia,
    quantidadeMoradores: r.qtMoradores,
    tarifaKwh: r.vlTarifaKwh,
  }))
  .pipe(residenceSchema);

export const javaConsumption = z
  .object({
    cdConsumo: id,
    cdResidencia: id,
    dtConsumo: isoDate,
    vlConsumoKwh: z.number().nonnegative(),
    dsOrigem: z.enum(["MANUAL", "IMPORTADO", "SIMULADO"]),
  })
  .transform((r) => ({
    id: r.cdConsumo,
    residenciaId: r.cdResidencia,
    data: r.dtConsumo,
    consumoKwh: r.vlConsumoKwh,
    origem: r.dsOrigem,
  }))
  .pipe(consumptionSchema);

export const javaGoal = z
  .object({
    cdMeta: id,
    cdResidencia: id,
    dtInicio: isoDate,
    dtFim: isoDate,
    vlLimiteKwh: z.number().positive(),
  })
  .transform((r) => ({
    id: r.cdMeta,
    residenciaId: r.cdResidencia,
    dataInicio: r.dtInicio,
    dataFim: r.dtFim,
    limiteKwh: r.vlLimiteKwh,
  }))
  .pipe(goalSchema);

export const javaPrediction = z
  .object({
    cdPrevisao: id,
    cdResidencia: id,
    dtAlvo: isoDate,
    vlPrevistoKwh: z.number().nonnegative(),
    dsModelo: z.string().min(1),
    avisos: z.array(z.string()),
  })
  .transform((r) => ({
    dataAlvo: r.dtAlvo,
    consumoPrevistoKwh: r.vlPrevistoKwh,
    modelo: r.dsModelo,
    avisos: r.avisos,
  }))
  .pipe(predictionSchema);

export const javaPattern = z
  .object({
    cdAnalise: id,
    cdResidencia: id,
    dtInicio: isoDate,
    dtFim: isoDate,
    cdGrupo: z.number().int().nonnegative(),
    dsInterpretacao: z.string().min(1),
    dsModelo: z.string().min(1),
    avisos: z.array(z.string()),
  })
  .transform((r) => ({
    dataInicio: r.dtInicio,
    dataFim: r.dtFim,
    grupo: r.cdGrupo,
    interpretacao: r.dsInterpretacao,
    modelo: r.dsModelo,
    avisos: r.avisos,
  }))
  .pipe(patternSchema);

export const javaFieldNames: Record<string, string> = {
  cdResidencia: "residenciaId",
  nmResidencia: "nome",
  qtMoradores: "quantidadeMoradores",
  vlTarifaKwh: "tarifaKwh",
  dtConsumo: "data",
  vlConsumoKwh: "consumoKwh",
  dsOrigem: "origem",
  dtInicio: "dataInicio",
  dtFim: "dataFim",
  vlLimiteKwh: "limiteKwh",
};
