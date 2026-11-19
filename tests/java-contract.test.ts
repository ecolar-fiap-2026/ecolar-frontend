import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../src/services/ecolar";

const residence = {
  cdResidencia: 1000,
  nmResidencia: "Casa teste",
  qtMoradores: 3,
  vlTarifaKwh: 0.95,
};
const consumption = {
  cdConsumo: 1001,
  cdResidencia: 1000,
  dtConsumo: "2026-11-16",
  vlConsumoKwh: 5.5,
  dsOrigem: "MANUAL",
};
const goal = {
  cdMeta: 1002,
  cdResidencia: 1000,
  dtInicio: "2026-11-01",
  dtFim: "2026-11-30",
  vlLimiteKwh: 150,
};
const fetcher = vi.fn<typeof fetch>();
function response(value: unknown, status = 200) {
  fetcher.mockResolvedValueOnce(
    new Response(status === 204 ? null : JSON.stringify(value), { status }),
  );
}
function sent() {
  return JSON.parse(String(fetcher.mock.calls.at(-1)?.[1]?.body));
}
beforeEach(() => {
  fetcher.mockReset();
  vi.stubEnv("VITE_API_BASE_URL", "http://localhost:8080");
  vi.stubGlobal("fetch", fetcher);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("Adaptador do contrato real Java 1.0.0 (Fetch controlado)", () => {
  it("lê lista Java e mantém os nomes de domínio das telas", async () => {
    response([residence]);
    await expect(api.residences()).resolves.toEqual([
      { id: 1000, nome: "Casa teste", quantidadeMoradores: 3, tarifaKwh: 0.95 },
    ]);
    expect(fetcher.mock.calls[0][0]).toBe("http://localhost:8080/residencias");
  });
  it("envia POST de residência com nomes Java e recebe ID", async () => {
    response(residence, 201);
    expect(
      (
        await api.saveResidence({
          nome: "Casa teste",
          quantidadeMoradores: 3,
          tarifaKwh: 0.95,
        })
      ).id,
    ).toBe(1000);
    expect(sent()).toEqual({
      nmResidencia: "Casa teste",
      qtMoradores: 3,
      vlTarifaKwh: 0.95,
    });
    expect(fetcher.mock.calls[0][1]?.method).toBe("POST");
  });
  it("envia PUT de residência para seu ID", async () => {
    response(residence);
    await api.saveResidence(
      { nome: "Casa teste", quantidadeMoradores: 3, tarifaKwh: 0.95 },
      1000,
    );
    expect(fetcher.mock.calls[0][0]).toBe(
      "http://localhost:8080/residencias/1000",
    );
    expect(fetcher.mock.calls[0][1]?.method).toBe("PUT");
  });
  it("cria consumo aninhado sem repetir cdResidencia no body", async () => {
    response(consumption, 201);
    const row = await api.saveConsumption(1000, {
      data: "2026-11-16",
      consumoKwh: 5.5,
      origem: "MANUAL",
    });
    expect(row).toMatchObject({
      id: 1001,
      residenciaId: 1000,
      consumoKwh: 5.5,
    });
    expect(sent()).toEqual({
      dtConsumo: "2026-11-16",
      vlConsumoKwh: 5.5,
      dsOrigem: "MANUAL",
    });
  });
  it("PUT de consumo inclui cdResidencia, nunca residenciaId", async () => {
    response(consumption);
    await api.saveConsumption(
      1000,
      { data: "2026-11-16", consumoKwh: 5.5, origem: "MANUAL" },
      1001,
    );
    expect(sent()).toEqual({
      cdResidencia: 1000,
      dtConsumo: "2026-11-16",
      vlConsumoKwh: 5.5,
      dsOrigem: "MANUAL",
    });
  });
  it("converte consumos de lista e consulta individual", async () => {
    response([consumption]);
    expect((await api.consumptions(1000))[0].data).toBe("2026-11-16");
    response(consumption);
    expect((await api.consumption(1001)).origem).toBe("MANUAL");
  });
  it("cria meta sem ID de casa duplicado e converte a resposta", async () => {
    response(goal, 201);
    expect(
      (
        await api.saveGoal(1000, {
          dataInicio: "2026-11-01",
          dataFim: "2026-11-30",
          limiteKwh: 150,
        })
      ).id,
    ).toBe(1002);
    expect(sent()).toEqual({
      dtInicio: "2026-11-01",
      dtFim: "2026-11-30",
      vlLimiteKwh: 150,
    });
  });
  it("PUT de meta inclui cdResidencia", async () => {
    response(goal);
    await api.saveGoal(
      1000,
      { dataInicio: "2026-11-01", dataFim: "2026-11-30", limiteKwh: 150 },
      1002,
    );
    expect(sent()).toHaveProperty("cdResidencia", 1000);
    expect(sent()).not.toHaveProperty("residenciaId");
    response([goal]);
    expect((await api.goals(1000))[0].limiteKwh).toBe(150);
  });
  it("mantém conflito 409 e traduz erros de campo para os inputs", async () => {
    response(
      {
        mensagem: "Confira os campos",
        campos: { nmResidencia: "Obrigatório", vlTarifaKwh: "Inválida" },
      },
      400,
    );
    await expect(
      api.saveResidence({ nome: "", quantidadeMoradores: 3, tarifaKwh: -1 }),
    ).rejects.toMatchObject({
      status: 400,
      fields: { nome: "Obrigatório", tarifaKwh: "Inválida" },
    });
    response({ mensagem: "Data duplicada" }, 409);
    await expect(
      api.saveConsumption(1000, {
        data: "2026-11-16",
        consumoKwh: 5.5,
        origem: "MANUAL",
      }),
    ).rejects.toMatchObject({ status: 409 });
  });
  it("chama previsoes com referência e preserva todos os avisos", async () => {
    response(
      {
        cdPrevisao: 1000,
        cdResidencia: 1,
        dtAlvo: "2026-10-15",
        vlPrevistoKwh: 11.385,
        dsModelo: "ecolar-ia-1.0/random-forest",
        avisos: ["Entrada SIMULADO", "Sem validação no Brasil"],
      },
      201,
    );
    const p = await api.predict(1, "2026-10-14");
    expect(p.consumoPrevistoKwh).toBe(11.385);
    expect(p.avisos).toHaveLength(2);
    expect(fetcher.mock.calls[0][0]).toBe(
      "http://localhost:8080/residencias/1/previsoes",
    );
    expect(sent()).toEqual({ dataReferencia: "2026-10-14" });
  });
  it("chama analises e aceita grupo zero sem tratar como ausente", async () => {
    response(
      {
        cdAnalise: 1000,
        cdResidencia: 1,
        dtInicio: "2026-10-08",
        dtFim: "2026-10-14",
        cdGrupo: 0,
        dsInterpretacao: "Menor intensidade relativa",
        dsModelo: "ecolar-ia-1.0/kmeans",
        avisos: ["Exploratório"],
      },
      201,
    );
    expect((await api.pattern(1, "2026-10-14")).grupo).toBe(0);
    expect(fetcher.mock.calls[0][0]).toBe(
      "http://localhost:8080/residencias/1/analises",
    );
    expect(sent()).toEqual({ dataReferencia: "2026-10-14" });
  });
  it("rejeita número em texto, data inválida e formato antigo", async () => {
    for (const bad of [
      { ...consumption, vlConsumoKwh: "5.5" },
      { ...consumption, dtConsumo: "2026-02-30" },
      { id: 1, data: "2026-11-16" },
    ]) {
      response(bad);
      await expect(api.consumption(1001)).rejects.toThrow("formato inesperado");
    }
  });
  it("aceita exclusões 204 sem inventar conteúdo", async () => {
    response(undefined, 204);
    await expect(api.deleteConsumption(1001)).resolves.toBeUndefined();
    response(undefined, 204);
    await expect(api.deleteGoal(1002)).resolves.toBeUndefined();
    response(undefined, 204);
    await expect(api.deleteResidence(1000)).resolves.toBeUndefined();
  });
});
