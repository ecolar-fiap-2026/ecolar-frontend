import { useState } from "react";
import { Sparkles } from "lucide-react";
import { api } from "../services/ecolar";
import { errorMessage } from "../services/http";
import type { Prediction, Pattern } from "../types/domain";
import { isoDate } from "../types/domain";
import { dateLabel, number, today } from "../utils/energy";
import { Field, Notice } from "./ui";

export function Analysis({
  residenceId,
  latestDate,
}: {
  residenceId: number;
  latestDate?: string;
}) {
  const [referenceDate, setReferenceDate] = useState(latestDate || "");
  const [prediction, setPrediction] = useState<Prediction>();
  const [pattern, setPattern] = useState<Pattern>();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const validDate =
    isoDate.safeParse(referenceDate).success && referenceDate <= today();
  async function analyze(kind: "previsao" | "padrao") {
    if (busy || !validDate) return;
    setBusy(kind);
    setError("");
    if (kind === "previsao") setPrediction(undefined);
    else setPattern(undefined);
    try {
      if (kind === "previsao")
        setPrediction(await api.predict(residenceId, referenceDate));
      else setPattern(await api.pattern(residenceId, referenceDate));
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy("");
    }
  }
  return (
    <section className="panel">
      <div className="flex items-center gap-3">
        <Sparkles className="text-forest" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Análises de consumo</h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Selecione o último dia de sete dias consecutivos registrados. Cada ação
        gera e salva um resultado no histórico. As análises dependem da IA
        conectada e não garantem economia.
      </p>
      <div className="mt-4 max-w-sm">
        <Field
          id="analysis-reference-date"
          label="Último dia observado"
          type="date"
          value={referenceDate}
          max={today()}
          disabled={!!busy}
          required
          hint="Começa no consumo mais recente da residência. A API confere se os sete dias existem."
          onChange={(event) => {
            setReferenceDate(event.target.value);
            setPrediction(undefined);
            setPattern(undefined);
            setError("");
          }}
        />
      </div>
      <div className="my-5 flex flex-wrap gap-3">
        <button
          className="btn-secondary"
          disabled={!!busy || !validDate}
          onClick={() => analyze("previsao")}
        >
          {busy === "previsao" ? "Gerando previsão…" : "Gerar previsão"}
        </button>
        <button
          className="btn-secondary"
          disabled={!!busy || !validDate}
          onClick={() => analyze("padrao")}
        >
          {busy === "padrao" ? "Analisando padrão…" : "Analisar padrão"}
        </button>
      </div>
      {error && <Notice kind="error">{error}</Notice>}
      {!validDate && (
        <Notice>
          Informe uma data válida, até hoje, com sete dias consecutivos
          registrados.
        </Notice>
      )}
      {prediction && (
        <div className="mt-4 border-t border-forest/10 pt-4" role="status">
          <p className="text-sm font-semibold">
            Previsão para {dateLabel(prediction.dataAlvo)}
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {number(prediction.consumoPrevistoKwh)} kWh
          </p>
          <p className="mt-2 text-xs text-slate-600">
            Modelo: {prediction.modelo}. Resultado estimado retornado pelo
            serviço.
          </p>
          <div className="mt-3 space-y-2">
            {prediction.avisos.map((aviso, i) => (
              <Notice key={i}>{aviso}</Notice>
            ))}
          </div>
        </div>
      )}
      {pattern && (
        <div className="mt-4 border-t border-forest/10 pt-4" role="status">
          <p className="font-semibold">Padrão {pattern.grupo}</p>
          <p className="mt-2 text-sm text-slate-600">{pattern.interpretacao}</p>
          <p className="mt-2 text-xs text-slate-600">
            {dateLabel(pattern.dataInicio)} a {dateLabel(pattern.dataFim)} ·
            Modelo: {pattern.modelo}
          </p>
          <div className="mt-3 space-y-2">
            {pattern.avisos.map((aviso, i) => (
              <Notice key={i}>{aviso}</Notice>
            ))}
          </div>
        </div>
      )}
      {!prediction && !pattern && !busy && !error && (
        <p className="text-xs text-slate-500">
          Nenhuma análise solicitada. Nenhuma previsão foi gerada.
        </p>
      )}
    </section>
  );
}
