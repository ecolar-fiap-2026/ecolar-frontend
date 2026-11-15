import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { request } from '../src/services/http';
import { residenceSchema } from '../src/types/domain';

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers(); });
describe('Contrato HTTP isolado', () => {
  it('não simula dados quando a URL está ausente', async () => { vi.stubEnv('VITE_API_BASE_URL', ''); const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher); await expect(request('/residencias', z.array(residenceSchema))).rejects.toThrow('ainda não está disponível'); expect(fetcher).not.toHaveBeenCalled(); });
  it('faz GET via Fetch e valida a resposta', async () => { vi.stubEnv('VITE_API_BASE_URL', 'https://api.exemplo.test/'); const row = { id: 1, nome: 'Casa teste', quantidadeMoradores: 3, tarifaKwh: 0.9 }; const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify([row]), { status: 200 })); vi.stubGlobal('fetch', fetcher); await expect(request('/residencias', z.array(residenceSchema))).resolves.toEqual([row]); expect(fetcher.mock.calls[0][0]).toBe('https://api.exemplo.test/residencias'); expect(fetcher.mock.calls[0][1].headers).not.toHaveProperty('Content-Type'); });
  it('rejeita JSON com contrato incompatível', async () => { vi.stubEnv('VITE_API_BASE_URL', 'https://api.exemplo.test'); vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"nome":"incompleto"}'))); await expect(request('/residencias/1', residenceSchema)).rejects.toThrow('formato inesperado'); });
  it('propaga conflito 409 sem confirmar sucesso', async () => { vi.stubEnv('VITE_API_BASE_URL', 'https://api.exemplo.test'); vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"mensagem":"Já existe consumo nessa data."}', { status: 409 }))); await expect(request('/consumos', z.unknown())).rejects.toMatchObject({ status: 409, message: 'Já existe consumo nessa data.' }); });
  it('não expõe resposta interna do servidor', async () => { vi.stubEnv('VITE_API_BASE_URL', 'https://api.exemplo.test'); vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"mensagem":"SQL secreto"}', { status: 500 }))); await expect(request('/consumos', z.unknown())).rejects.toThrow('indisponível'); });
  it('aceita DELETE 204 sem tentar ler JSON', async () => { vi.stubEnv('VITE_API_BASE_URL', 'https://api.exemplo.test'); vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 }))); await expect(request('/consumos/1', z.undefined(), { method: 'DELETE' })).resolves.toBeUndefined(); });
  it('distingue falha de rede de sucesso', async () => { vi.stubEnv('VITE_API_BASE_URL', 'https://api.exemplo.test'); vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network error'))); await expect(request('/consumos', z.unknown())).rejects.toThrow('Não foi possível conectar'); });
});
