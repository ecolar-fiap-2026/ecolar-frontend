import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Field,
  Loading,
  Notice,
  PageIntro,
  RemoteError,
  SelectField,
} from "../components/ui";
import { useRemote } from "../hooks/useRemote";
import { api } from "../services/ecolar";
import { ApiError, errorMessage } from "../services/http";
import type { Consumption, Residence } from "../types/domain";
import {
  consumptionInput,
  decimal,
  fieldsFrom,
  routeId,
} from "../utils/validation";
import { MeterCalculator } from "../components/MeterCalculator";
import { today } from "../utils/energy";
import NotFound from "./NotFound";

export default function ConsumptionEditor() {
  const params = useParams();
  const id = routeId(params.id);
  const consumptionId = params.consumoId
    ? routeId(params.consumoId)
    : undefined;
  return id && consumptionId !== null ? (
    <EditorLoader
      key={`${id}-${consumptionId}`}
      id={id}
      consumptionId={consumptionId}
    />
  ) : (
    <NotFound />
  );
}
function EditorLoader({
  id,
  consumptionId,
}: {
  id: number;
  consumptionId?: number;
}) {
  const loader = useCallback(
    async (signal: AbortSignal) => {
      const [residence, consumption] = await Promise.all([
        api.residence(id, signal),
        consumptionId ? api.consumption(consumptionId, signal) : undefined,
      ]);
      if (consumption && consumption.residenciaId !== id)
        throw new ApiError(
          "Este consumo não pertence à residência selecionada.",
          404,
        );
      return { residence, consumption };
    },
    [id, consumptionId],
  );
  const remote = useRemote(loader);
  if (remote.loading) return <Loading />;
  if (remote.error || !remote.data)
    return <RemoteError message={remote.error} retry={remote.reload} />;
  return (
    <Editor
      residence={remote.data.residence}
      consumption={remote.data.consumption}
    />
  );
}
function Editor({
  residence,
  consumption,
}: {
  residence: Residence;
  consumption?: Consumption;
}) {
  const [data, setData] = useState(consumption?.data || today());
  const [value, setValue] = useState(
    consumption ? String(consumption.consumoKwh) : "",
  );
  const [origin, setOrigin] = useState<Consumption["origem"]>(
    consumption?.origem || "SIMULADO",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<Consumption>();
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const parsed = consumptionInput.safeParse({
      data,
      consumoKwh: decimal(value),
      origem: origin,
    });
    if (!parsed.success) {
      setErrors(fieldsFrom(parsed.error));
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      setSaved(
        await api.saveConsumption(residence.id, parsed.data, consumption?.id),
      );
    } catch (cause) {
      setError(errorMessage(cause));
      if (cause instanceof ApiError) setErrors(cause.fields);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-2xl">
      <Link to={`/residencias/${residence.id}`} className="text-link mb-6">
        Voltar ao painel
      </Link>
      <PageIntro
        eyebrow={residence.nome}
        title={consumption ? "Corrigir consumo" : "Registrar consumo diário"}
        description="Informe a energia consumida no dia em kWh. Não use potência em watts nem a leitura acumulada do medidor."
      />
      {saved ? (
        <div className="space-y-5">
          <Notice kind="success">
            Consumo {consumption ? "atualizado" : "registrado"} com sucesso. O
            serviço confirmou o registro #{saved.id}.
          </Notice>
          <Link className="btn" to={`/residencias/${residence.id}`}>
            Ver histórico atualizado
          </Link>
        </div>
      ) : (
        <form className="panel space-y-5" onSubmit={submit} noValidate>
          {error && <Notice kind="error">{error}</Notice>}
          <Field
            label="Data do consumo"
            id="consumption-date"
            hint="Use um lançamento por dia para cada casa. Para corrigir uma data já registrada, abra o histórico e edite o consumo."
            required
            type="date"
            max={today()}
            value={data}
            error={errors.data}
            onChange={(event) => setData(event.target.value)}
          />
          <Field
            label="Consumo diário (kWh)"
            id="consumption-value"
            required
            inputMode="decimal"
            placeholder="Ex.: 7,5"
            hint="kWh é a energia consumida. Se você só tem a leitura acumulada, use a calculadora abaixo."
            value={value}
            error={errors.consumoKwh}
            onChange={(event) => setValue(event.target.value)}
          />
          <MeterCalculator
            onUse={(kwh, date) => {
              setValue(String(kwh).replace(".", ","));
              setData(date);
              setErrors({});
            }}
          />
          <SelectField
            id="consumption-origin"
            label="Origem do dado"
            value={origin}
            onChange={(event) =>
              setOrigin(event.target.value as Consumption["origem"])
            }
          >
            <option value="SIMULADO">Simulado · exemplo fictício</option>
            <option value="MANUAL">Manual · informado pelo morador</option>
            <option value="IMPORTADO">
              Importado · proveniente de arquivo
            </option>
          </SelectField>
          <p className="text-xs leading-relaxed text-slate-600">
            Escolha Simulado para os dados fictícios da apresentação. A seleção
            Importado apenas identifica a origem, não importa arquivos.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="btn" disabled={busy}>
              {busy ? "Salvando…" : "Salvar consumo"}
            </button>
            <Link className="btn-secondary" to={`/residencias/${residence.id}`}>
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
