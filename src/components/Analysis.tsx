import { useState } from "react";
import { Sparkles } from "lucide-react";
import { api } from "../services/ecolar";
import { errorMessage } from "../services/http";
import type { Prediction, Pattern } from "../types/domain";
import { dateLabel, number } from "../utils/energy";
import { Notice } from "./ui";

export function Analysis({ residenceId }: { residenceId: number }) {
  const [prediction, setPrediction] = useState<Prediction>();
  const [pattern, setPattern] = useState<Pattern>();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  async function analyze(kind: "previsao" | "padrao") {
    setBusy(kind);
    setError("");
    if (kind === "previsao") setPrediction(undefined);
    else setPattern(undefined);
    try {
      if (kind === "previsao") setPrediction(await api.predict(residenceId));
      else setPattern(await api.pattern(residenceId));
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
        A proposta utiliza sete dias consecutivos para previsão e agrupamento.
        As análises dependem do serviço de IA conectado e não garantem economia.
      </p>
      <div className="my-5 flex flex-wrap gap-3">
        <button
          className="btn-secondary"
          disabled={!!busy}
          onClick={() => analyze("previsao")}
        >
          {busy === "previsao" ? "Consultando previsão…" : "Consultar previsão"}
        </button>
        <button
          className="btn-secondary"
          disabled={!!busy}
          onClick={() => analyze("padrao")}
        >
          {busy === "padrao" ? "Analisando padrão…" : "Analisar padrão"}
        </button>
      </div>
      {error && <Notice kind="error">{error}</Notice>}
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
