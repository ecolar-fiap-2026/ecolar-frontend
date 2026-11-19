import { MeterCalculator } from "../components/MeterCalculator";
import { useState } from "react";
import type { FormEvent } from "react";
import { z } from "zod";
import { Field, Notice, PageIntro } from "../components/ui";
import { decimal, fieldsFrom } from "../utils/validation";
import { money, number, simulate } from "../utils/energy";

const numeric = z.number({ error: "Informe um número válido." });
const schema = z.object({
  watts: numeric
    .positive("Informe uma potência maior que zero.")
    .max(1_000_000, "Confira a potência informada."),
  hours: numeric
    .min(0, "O valor não pode ser negativo.")
    .max(24, "Use no máximo 24 horas por dia."),
  alternative: numeric
    .min(0, "O valor não pode ser negativo.")
    .max(24, "Use no máximo 24 horas por dia."),
  quantity: numeric
    .int("Informe uma quantidade inteira.")
    .min(1, "Informe pelo menos 1.")
    .max(1000, "Use no máximo 1.000 aparelhos."),
  days: numeric
    .int("Informe dias inteiros.")
    .min(1, "Informe pelo menos 1.")
    .max(3660, "Use no máximo 3.660 dias."),
  tariff: numeric
    .min(0, "O valor não pode ser negativo.")
    .max(100, "Confira a tarifa por kWh."),
});
export default function Simulator() {
  const [form, setForm] = useState({
    watts: "1000",
    hours: "5",
    alternative: "4",
    quantity: "1",
    days: "30",
    tariff: "0,90",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    current: ReturnType<typeof simulate>;
    alternative: ReturnType<typeof simulate>;
    days: number;
  }>();
  function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(
      Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, decimal(value)]),
      ),
    );
    if (!parsed.success) {
      setErrors(fieldsFrom(parsed.error));
      setResult(undefined);
      return;
    }
    setErrors({});
    const { watts, hours, quantity, days, tariff, alternative } = parsed.data;
    setResult({
      current: simulate(watts, hours, quantity, days, tariff),
      alternative: simulate(watts, alternative, quantity, days, tariff),
      days,
    });
  }
  const fields: { key: keyof typeof form; label: string }[] = [
    { key: "watts", label: "Potência do aparelho (W)" },
    { key: "quantity", label: "Quantidade de aparelhos" },
    { key: "hours", label: "Uso atual (horas/dia)" },
    { key: "alternative", label: "Novo cenário (horas/dia)" },
    { key: "days", label: "Período (dias)" },
    { key: "tariff", label: "Tarifa informada (R$/kWh)" },
  ];
  return (
    <>
      <PageIntro
        eyebrow="Experimente possibilidades"
        title="Pequenas mudanças, em números."
        description="Compare dois cenários de uso de um aparelho. Este cálculo funciona no navegador e não grava dados na residência."
      />
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <form className="panel space-y-6" onSubmit={submit} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map(({ key, label }) => (
              <Field
                key={key}
                id={`sim-${key}`}
                label={label}
                inputMode="decimal"
                required
                value={form[key]}
                error={errors[key]}
                onChange={(event) => {
                  setForm({ ...form, [key]: event.target.value });
                  setResult(undefined);
                }}
              />
            ))}
          </div>
          <button className="btn">Comparar cenários</button>
          <p className="text-xs leading-relaxed text-slate-500">
            Valores iniciais ilustrativos: 1.000 W, 5 horas/dia e tarifa
            fictícia de R$ 0,90/kWh. Ajuste para o seu cenário.
          </p>
        </form>
        <div className="space-y-5">
          {result ? (
            <section
              className="rounded-2xl bg-forest p-7 text-white"
              aria-live="polite"
            >
              <p className="text-xs uppercase tracking-widest text-leaf">
                Estimativa em {result.days} dias
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                {money(Math.abs(result.current.cost - result.alternative.cost))}
              </h2>
              <p className="mt-2 text-sm text-white/75">
                {result.current.cost >= result.alternative.cost
                  ? "Redução estimada no cenário alternativo"
                  : "Aumento estimado no cenário alternativo"}
              </p>
              <div className="mt-7 grid grid-cols-2 gap-5 border-t border-white/20 pt-5">
                <div>
                  <h3 className="text-sm text-white/70">Uso atual</h3>
                  <p className="mt-2 text-xl font-semibold">
                    {number(result.current.kwh)} kWh
                  </p>
                  <p className="mt-1 text-sm">{money(result.current.cost)}</p>
                </div>
                <div>
                  <h3 className="text-sm text-white/70">Novo cenário</h3>
                  <p className="mt-2 text-xl font-semibold">
                    {number(result.alternative.kwh)} kWh
                  </p>
                  <p className="mt-1 text-sm">
                    {money(result.alternative.cost)}
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl bg-forest p-8 text-white">
              <p className="text-xs uppercase tracking-widest text-leaf">
                Uma escolha de cada vez
              </p>
              <h2 className="mt-5 text-3xl font-semibold leading-tight">
                E se você mudasse o tempo de uso?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                Preencha os dois cenários e veja uma estimativa da diferença. O
                cálculo usa potência nominal, quantidade, horas e dias.
              </p>
            </section>
          )}
          <Notice>
            Simulação matemática, sem inteligência artificial. Aparelhos podem
            variar a potência durante o uso. O resultado não é uma medição nem
            uma promessa de economia.
          </Notice>
          <p className="px-1 text-sm leading-relaxed text-slate-600">
            <strong>Como calculamos:</strong> kWh = (W ÷ 1.000) × quantidade ×
            horas/dia × dias. Custo estimado = kWh × tarifa.
          </p>
        </div>
      </div>
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">
          Já tem duas leituras do medidor?
        </h2>
        <MeterCalculator />
      </section>
    </>
  );
}
