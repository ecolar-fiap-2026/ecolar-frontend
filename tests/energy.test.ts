import { describe, expect, it } from 'vitest';
import { dayCount, goalSummary, simulate, summary } from '../src/utils/energy';
import { consumptionInput, decimal, fieldsFrom, goalInput, residenceInput, routeId } from '../src/utils/validation';
import { z } from 'zod';
import type { Consumption, Goal } from '../src/types/domain';

const records: Consumption[] = [
  { id: 1, residenciaId: 1, data: '2026-10-01', consumoKwh: 7.5, origem: 'SIMULADO' },
  { id: 2, residenciaId: 1, data: '2026-10-03', consumoKwh: 0, origem: 'SIMULADO' },
];
const goal: Goal = { id: 1, residenciaId: 1, dataInicio: '2026-10-01', dataFim: '2026-10-03', limiteKwh: 10 };
describe('Cálculos e cobertura', () => {
  it('calcula o cenário nominal de referência', () => expect(simulate(1000, 5, 1, 30, 0.9)).toEqual({ kwh: 150, cost: 135 }));
  it('não confunde zero registrado com um dia ausente', () => expect(summary(records, '2026-10-01', '2026-10-03')).toMatchObject({ days: 2, expectedDays: 3, total: 7.5, average: 3.75 }));
  it('não cria média para um intervalo vazio', () => expect(summary([], '2026-10-01', '2026-10-31').average).toBeNull());
  it('não afirma meta cumprida com cobertura parcial', () => expect(goalSummary(records, goal).status).toBe('Período parcial'));
  it('sinaliza excesso mesmo em período parcial', () => expect(goalSummary(records, { ...goal, limiteKwh: 5 }).status).toBe('Limite ultrapassado'));
  it('sinaliza falta de dados', () => expect(goalSummary([], goal).status).toBe('Sem registros'));
  it('considera ano bissexto e limites inclusivos', () => expect(dayCount('2024-02-28', '2024-03-01')).toBe(3));
  it('respeita o filtro e a ordem cronológica', () => expect(summary([...records].reverse(), '2026-10-01', '2026-10-01').records.map((r) => r.id)).toEqual([1]));
});
describe('Entradas do domínio', () => {
  it('preserva a mensagem de e-mail e traduz somente o formato de data', () => {
    const result = z.object({ email: z.email('Informe um e-mail válido.'), data: z.iso.date() }).safeParse({ email: 'invalido', data: '2026-02-30' });
    if (result.success) throw new Error('Entradas inválidas foram aceitas');
    expect(fieldsFrom(result.error)).toEqual({ email: 'Informe um e-mail válido.', data: 'Informe uma data válida.' });
  });
  it.each(['1e3', '', 'NaN', 'Infinity', '1.234,56', '-1'])('rejeita formato numérico ambíguo ou inválido: %s', (input) => expect(Number.isNaN(decimal(input))).toBe(true));
  it('aceita vírgula decimal', () => expect(decimal(' 7,5 ')).toBe(7.5));
  it('rejeita moradores fracionários', () => expect(residenceInput.safeParse({ nome: 'Casa', quantidadeMoradores: 1.5, tarifaKwh: 0.9 }).success).toBe(false));
  it('rejeita consumo futuro e datas impossíveis', () => {
    for (const data of ['2999-01-01', '2026-02-30']) expect(consumptionInput.safeParse({ data, consumoKwh: 1, origem: 'SIMULADO' }).success).toBe(false);
  });
  it('rejeita período invertido', () => expect(goalInput.safeParse({ dataInicio: '2026-11-10', dataFim: '2026-11-01', limiteKwh: 10 }).success).toBe(false));
  it.each(['0', '-1', '1x', '1.5', '9007199254740993'])('rejeita ID inválido: %s', (id) => expect(routeId(id)).toBeNull());
});
