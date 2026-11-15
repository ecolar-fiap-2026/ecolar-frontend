import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Analysis } from "../components/Analysis";
import { ConsumptionChart } from "../components/ConsumptionChart";
import {
  ConfirmDialog,
  Empty,
  Field,
  Loading,
  Notice,
  PageIntro,
  RemoteError,
  Stat,
} from "../components/ui";
import { useRemote } from "../hooks/useRemote";
import { api } from "../services/ecolar";
import { errorMessage } from "../services/http";
import { isoDate } from "../types/domain";
import type { Consumption } from "../types/domain";
import {
  dateLabel,
  goalSummary,
  money,
  number,
  summary,
  today,
} from "../utils/energy";
import { routeId } from "../utils/validation";
import NotFound from "./NotFound";

export default function Dashboard() {
  const id = routeId(useParams().id);
  return id ? <ResidenceDashboard key={id} id={id} /> : <NotFound />;
}
function ResidenceDashboard({ id }: { id: number }) {
  const loader = useCallback(
    async (signal: AbortSignal) => {
      const [residence, records, goals] = await Promise.all([
        api.residence(id, signal),
        api.consumptions(id, signal),
        api.goals(id, signal),
      ]);
      return { residence, records, goals };
    },
    [id],
  );
  const remote = useRemote(loader);
  const [start, setStart] = useState(`${today().slice(0, 7)}-01`);
  const [end, setEnd] = useState(today());
  const [removing, setRemoving] = useState<Consumption>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function remove() {
    if (!removing) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await api.deleteConsumption(removing.id);
      setSuccess("Consumo excluído. O histórico foi atualizado.");
      remote.reload();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
      setRemoving(undefined);
    }
  }
  if (remote.loading) return <Loading />;
  if (remote.error || !remote.data)
    return (
      <>
        <Link className="text-link mb-6" to="/residencias">
          <ArrowLeft size={16} />
          Voltar às residências
        </Link>
        <RemoteError message={remote.error} retry={remote.reload} />
      </>
    );
  const { residence, records, goals } = remote.data;
  const validPeriod =
    isoDate.safeParse(start).success &&
    isoDate.safeParse(end).success &&
    start <= end;
  const result = validPeriod ? summary(records, start, end) : null;
  return (
    <>
      <Link className="text-link mb-5" to="/residencias">
        <ArrowLeft size={16} />
        Residências
      </Link>
      <PageIntro
        eyebrow="Painel da residência"
        title={residence.nome}
        description={`${residence.quantidadeMoradores} moradores · Tarifa informada: R$ ${number(residence.tarifaKwh, 4)}/kWh`}
      >
        <Link className="btn shrink-0" to={`/residencias/${id}/consumos/novo`}>
          <Plus size={18} />
          Registrar consumo
        </Link>
      </PageIntro>
      <div className="mb-6 space-y-3">
        {success && <Notice kind="success">{success}</Notice>}
        {error && <Notice kind="error">{error}</Notice>}
      </div>
      <section className="panel mb-6" aria-label="Filtro de período">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <Field
              id="filter-start"
              label="Início do período"
              type="date"
              value={start}
              onChange={(event) => setStart(event.target.value)}
            />
            <Field
              id="filter-end"
              label="Fim do período"
              type="date"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
            />
          </div>
          <button className="btn-secondary" onClick={remote.reload}>
            Atualizar dados
          </button>
        </div>
        {!validPeriod && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            Informe datas válidas e um fim igual ou posterior ao início.
          </p>
        )}
      </section>
      {result && (
        <>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Stat
              label="Consumo registrado"
              value={
                result.days ? `${number(result.total)} kWh` : "Sem registros"
              }
              hint="Soma somente dos dias informados"
            />
            <Stat
              label="Custo estimado"
              value={
                result.days
                  ? money(result.total * residence.tarifaKwh)
                  : "Sem estimativa"
              }
              hint="Consumo × tarifa atual informada"
            />
            <Stat
              label="Cobertura do período"
              value={`${result.days} / ${result.expectedDays} dias`}
              hint={
                result.days < result.expectedDays
                  ? "Período parcial · há dias sem registro"
                  : "Todos os dias possuem registro"
              }
            />
          </div>
          <div className="mb-6">
            <Notice>
              {result.days < result.expectedDays
                ? "O período está incompleto. Dias sem registro não são consumo zero. "
                : ""}
              O custo é uma estimativa e não inclui tributos, bandeiras ou
              cobranças fixas.
              {result.records.some((record) => record.origem === "SIMULADO")
                ? " Este período contém dados simulados."
                : ""}
            </Notice>
          </div>
          <section className="panel mb-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">
                Seu consumo ao longo dos dias
              </h2>
              <p className="text-sm text-slate-600">
                {result.average === null
                  ? "Sem média disponível"
                  : `Média registrada: ${number(result.average)} kWh/dia`}
              </p>
            </div>
            <ConsumptionChart records={result.records} />
          </section>
          <section className="mb-8" aria-label="Histórico de consumo">
            <h2 className="mb-4 text-xl font-semibold">Histórico do período</h2>
            {!result.records.length ? (
              <Empty
                title="Nenhum consumo neste intervalo"
                to={`/residencias/${id}/consumos/novo`}
                action="Registrar primeiro consumo"
              >
                Ajuste as datas ou registre um dia para começar a acompanhar.
              </Empty>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {[...result.records].reverse().map((record) => (
                  <article
                    key={record.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forest/10 bg-white p-4"
                  >
                    <div>
                      <h3 className="text-sm font-semibold">
                        {dateLabel(record.data)}
                      </h3>
                      <p className="mt-1 text-lg font-semibold">
                        {number(record.consumoKwh, 3)} kWh
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {record.origem === "SIMULADO"
                          ? "Dado simulado"
                          : record.origem === "IMPORTADO"
                            ? "Dado importado"
                            : "Registro manual"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        className="btn-secondary px-3"
                        aria-label={`Editar consumo de ${dateLabel(record.data)}`}
                        to={`/residencias/${id}/consumos/${record.id}/editar`}
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        className="btn-secondary px-3 text-red-700"
                        aria-label={`Excluir consumo de ${dateLabel(record.data)}`}
                        onClick={() => setRemoving(record)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
      <section className="panel mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Metas da residência</h2>
          <Link className="text-link" to={`/residencias/${id}/metas`}>
            Gerenciar metas
          </Link>
        </div>
        {!goals.length ? (
          <p className="mt-3 text-sm text-slate-600">
            Nenhuma meta definida. Escolha um intervalo e um limite para
            acompanhar.
          </p>
        ) : (
          <div className="mt-5 space-y-5">
            {goals.map((goal) => {
              const status = goalSummary(records, goal);
              return (
                <div key={goal.id} className="border-t border-forest/10 pt-4">
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <p>
                      {dateLabel(goal.dataInicio)} a {dateLabel(goal.dataFim)}
                    </p>
                    <p className="font-semibold">{status.status}</p>
                  </div>
                  <progress
                    className="my-3 h-3 w-full accent-forest"
                    max={100}
                    value={status.percentage}
                    aria-label={`Uso da meta de ${number(goal.limiteKwh)} kWh`}
                  />
                  <p className="text-sm text-slate-600">
                    {number(status.total)} de {number(goal.limiteKwh)} kWh ·{" "}
                    {status.days}/{status.expectedDays} dias registrados
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <Analysis key={id} residenceId={id} />
      <ConfirmDialog
        open={!!removing}
        title="Excluir consumo?"
        description={`O registro de ${removing ? dateLabel(removing.data) : ""} será removido. Essa alteração afeta os totais e as metas.`}
        busy={busy}
        onCancel={() => setRemoving(undefined)}
        onConfirm={remove}
      />
    </>
  );
}
