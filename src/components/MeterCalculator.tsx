import { useState } from "react";
import { Calculator } from "lucide-react";
import { Field, Notice } from "./ui";
import { number, today } from "../utils/energy";
import { decimal } from "../utils/validation";
import { readingDifference } from "../utils/readings";

type ReadingResult = ReturnType<typeof readingDifference>;
export function MeterCalculator({
  onUse,
}: {
  onUse?: (kwh: number, date: string) => void;
}) {
  const [form, setForm] = useState({
    previous: "",
    current: "",
    start: "",
    end: today(),
  });
  const [result, setResult] = useState<ReadingResult>();
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  function change(key: keyof typeof form, value: string) {
    setForm({ ...form, [key]: value });
    setResult(undefined);
    setError("");
    setApplied(false);
  }
  function calculate() {
    setResult(undefined);
    setError("");
    setApplied(false);
    try {
      if (form.end > today())
        throw new Error("Informe leituras até a data de hoje.");
      setResult(
        readingDifference(
          decimal(form.previous),
          decimal(form.current),
          form.start,
          form.end,
        ),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Confira as leituras.");
    }
  }
  return (
    <details
      className="rounded-2xl border border-forest/15 bg-mint/40 p-5"
      id="leituras"
    >
      <summary className="min-h-11 text-sm font-semibold text-forest">
        <span className="ml-2 inline-flex items-center gap-2 align-middle">
          <Calculator size={18} aria-hidden="true" />
          Tenho a leitura do medidor. Como calcular?
        </span>
      </summary>
      <div className="mt-4 space-y-5">
        <p className="text-sm leading-relaxed text-slate-600">
          O medidor mostra energia acumulada. Subtraia a leitura anterior da
          atual. Para registrar um dia, as leituras precisam ser de dias
          consecutivos, no mesmo horário.
        </p>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-forest">
            Leitura anterior
          </legend>
          <Field
            id="meter-start"
            label="Data anterior"
            type="date"
            max={today()}
            value={form.start}
            onChange={(event) => change("start", event.target.value)}
          />
          <Field
            id="meter-previous"
            label="Leitura anterior (kWh)"
            inputMode="decimal"
            placeholder="Ex.: 1000"
            value={form.previous}
            onChange={(event) => change("previous", event.target.value)}
          />
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-forest">
            Leitura atual
          </legend>
          <Field
            id="meter-end"
            label="Data atual"
            type="date"
            max={today()}
            value={form.end}
            onChange={(event) => change("end", event.target.value)}
          />
          <Field
            id="meter-current"
            label="Leitura atual (kWh)"
            inputMode="decimal"
            placeholder="Ex.: 1007,5"
            value={form.current}
            onChange={(event) => change("current", event.target.value)}
          />
        </fieldset>
        <button type="button" className="btn-secondary" onClick={calculate}>
          Calcular diferença
        </button>
        {error && <Notice kind="error">{error}</Notice>}
        {result && (
          <div aria-live="polite" className="rounded-xl bg-white p-5">
            <p className="text-xs text-slate-600">Consumo entre as leituras</p>
            <p className="mt-2 text-2xl font-bold text-forest">
              {number(result.kwh, 3)} kWh{" "}
              <span className="text-sm font-normal text-slate-600">
                em {result.days} {result.days === 1 ? "dia" : "dias"}
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {result.daily
                ? "Se as leituras foram feitas no mesmo horário, use este resultado como consumo do intervalo diário, na data da leitura atual."
                : "Este total cobre vários dias. Ele não pode ser salvo como consumo de um único dia. Use leituras consecutivas; uma média não é uma medição diária."}
            </p>
            {onUse && result.daily && (
              <button
                type="button"
                className="btn mt-4"
                onClick={() => {
                  onUse(result.kwh, form.end);
                  setApplied(true);
                }}
              >
                Usar no formulário
              </button>
            )}
            {applied && (
              <p role="status" className="mt-3 text-sm text-forest">
                Valor e data preenchidos. Confira a origem e escolha Salvar
                consumo para enviar.
              </p>
            )}
          </div>
        )}
      </div>
    </details>
  );
}
