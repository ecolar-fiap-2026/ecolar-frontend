import { z } from "zod";
import { request } from "./http";
import {
  residenceSchema,
  consumptionSchema,
  goalSchema,
  predictionSchema,
  patternSchema,
} from "../types/domain";
import type {
  ResidenceInput,
  ConsumptionInput,
  GoalInput,
} from "../types/domain";

const body = (method: string, data: unknown): RequestInit => ({
  method,
  body: JSON.stringify(data),
});

export const api = {
  residences: (signal?: AbortSignal) =>
    request("/residencias", z.array(residenceSchema), { signal }),
  residence: (id: number, signal?: AbortSignal) =>
    request(`/residencias/${id}`, residenceSchema, { signal }),
  saveResidence: (data: ResidenceInput, id?: number) =>
    request(
      id ? `/residencias/${id}` : "/residencias",
      residenceSchema,
      body(id ? "PUT" : "POST", data),
    ),
  deleteResidence: (id: number) =>
    request(`/residencias/${id}`, z.undefined(), { method: "DELETE" }),
  consumptions: (id: number, signal?: AbortSignal) =>
    request(`/residencias/${id}/consumos`, z.array(consumptionSchema), {
      signal,
    }),
  consumption: (id: number, signal?: AbortSignal) =>
    request(`/consumos/${id}`, consumptionSchema, { signal }),
  saveConsumption: (residenceId: number, data: ConsumptionInput, id?: number) =>
    request(
      id ? `/consumos/${id}` : `/residencias/${residenceId}/consumos`,
      consumptionSchema,
      body(
        id ? "PUT" : "POST",
        id ? { ...data, residenciaId: residenceId } : data,
      ),
    ),
  deleteConsumption: (id: number) =>
    request(`/consumos/${id}`, z.undefined(), { method: "DELETE" }),
  goals: (id: number, signal?: AbortSignal) =>
    request(`/residencias/${id}/metas`, z.array(goalSchema), { signal }),
  saveGoal: (residenceId: number, data: GoalInput, id?: number) =>
    request(
      id ? `/metas/${id}` : `/residencias/${residenceId}/metas`,
      goalSchema,
      body(
        id ? "PUT" : "POST",
        id ? { ...data, residenciaId: residenceId } : data,
      ),
    ),
  deleteGoal: (id: number) =>
    request(`/metas/${id}`, z.undefined(), { method: "DELETE" }),
  predict: (id: number) =>
    request(`/residencias/${id}/previsao`, predictionSchema, {
      method: "POST",
    }),
  pattern: (id: number) =>
    request(`/residencias/${id}/padrao`, patternSchema, { method: "POST" }),
};
