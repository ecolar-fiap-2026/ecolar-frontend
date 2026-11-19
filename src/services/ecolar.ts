import { z } from "zod";
import { ApiError, request } from "./http";
import {
  javaResidence,
  javaConsumption,
  javaGoal,
  javaPrediction,
  javaPattern,
  javaFieldNames,
} from "./java-contract";
import type {
  ResidenceInput,
  ConsumptionInput,
  GoalInput,
} from "../types/domain";

const body = (method: string, data: unknown): RequestInit => ({
  method,
  body: JSON.stringify(data),
});

// Os componentes mantêm seus nomes de domínio; só esta camada traduz o contrato Java.
async function javaRequest<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestInit = {},
): Promise<T> {
  try {
    return await request(path, schema, options);
  } catch (error) {
    if (error instanceof ApiError) {
      const fields = Object.fromEntries(
        Object.entries(error.fields).map(([key, value]) => [
          javaFieldNames[key] ?? key,
          value,
        ]),
      );
      throw new ApiError(error.message, error.status, fields);
    }
    throw error;
  }
}
export const api = {
  residences: (signal?: AbortSignal) =>
    javaRequest("/residencias", z.array(javaResidence), { signal }),
  residence: (id: number, signal?: AbortSignal) =>
    javaRequest(`/residencias/${id}`, javaResidence, { signal }),
  saveResidence: (data: ResidenceInput, id?: number) =>
    javaRequest(
      id ? `/residencias/${id}` : "/residencias",
      javaResidence,
      body(id ? "PUT" : "POST", {
        nmResidencia: data.nome,
        qtMoradores: data.quantidadeMoradores,
        vlTarifaKwh: data.tarifaKwh,
      }),
    ),
  deleteResidence: (id: number) =>
    javaRequest(`/residencias/${id}`, z.undefined(), { method: "DELETE" }),
  consumptions: (id: number, signal?: AbortSignal) =>
    javaRequest(`/residencias/${id}/consumos`, z.array(javaConsumption), {
      signal,
    }),
  consumption: (id: number, signal?: AbortSignal) =>
    javaRequest(`/consumos/${id}`, javaConsumption, { signal }),
  saveConsumption: (residenceId: number, data: ConsumptionInput, id?: number) =>
    javaRequest(
      id ? `/consumos/${id}` : `/residencias/${residenceId}/consumos`,
      javaConsumption,
      body(id ? "PUT" : "POST", {
        dtConsumo: data.data,
        vlConsumoKwh: data.consumoKwh,
        dsOrigem: data.origem,
        ...(id ? { cdResidencia: residenceId } : {}),
      }),
    ),
  deleteConsumption: (id: number) =>
    javaRequest(`/consumos/${id}`, z.undefined(), { method: "DELETE" }),
  goals: (id: number, signal?: AbortSignal) =>
    javaRequest(`/residencias/${id}/metas`, z.array(javaGoal), { signal }),
  saveGoal: (residenceId: number, data: GoalInput, id?: number) =>
    javaRequest(
      id ? `/metas/${id}` : `/residencias/${residenceId}/metas`,
      javaGoal,
      body(id ? "PUT" : "POST", {
        dtInicio: data.dataInicio,
        dtFim: data.dataFim,
        vlLimiteKwh: data.limiteKwh,
        ...(id ? { cdResidencia: residenceId } : {}),
      }),
    ),
  deleteGoal: (id: number) =>
    javaRequest(`/metas/${id}`, z.undefined(), { method: "DELETE" }),
  predict: (id: number, dataReferencia: string) =>
    javaRequest(
      `/residencias/${id}/previsoes`,
      javaPrediction,
      body("POST", { dataReferencia }),
    ),
  pattern: (id: number, dataReferencia: string) =>
    javaRequest(
      `/residencias/${id}/analises`,
      javaPattern,
      body("POST", { dataReferencia }),
    ),
};
