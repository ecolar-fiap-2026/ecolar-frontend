import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  Download,
  Target,
} from "lucide-react";
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
import { consumptionCsv, recentPeriod } from "../utils/history";
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
  const { hash } = useLocation();
  useEffect(() => {
    if (remote.data && hash === "#historico")
      document.getElementById("historico")?.scrollIntoView({ block: "start" });
  }, [remote.data, hash]);
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
        <PageIntro
          eyebrow="Painel da residência"
          title="Visão geral da sua casa"
          description="Aqui você acompanha o consumo registrado, os custos estimados e suas metas."
        />
        <div className="panel space-y-5">
          <RemoteError message={remote.error} retry={remote.reload} />
          <p className="text-sm text-slate-600">
            Os indicadores aparecerão quando conseguirmos consultar os registros
            desta residência.
          </p>
          <Link className="text-link" to="/simulador">
            Enquanto isso, experimentar o simulador
          </Link>
        </div>
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
        eyebrow={residence.nome}
        title="Visão geral da sua casa"
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
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">
            Qual período você quer acompanhar?
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-lg border border-forest/15 px-3 py-2 text-xs font-semibold text-forest hover:bg-mint"
              onClick={() => {
                setStart(`${today().slice(0, 7)}-01`);
                setEnd(today());
              }}
            >
              Este mês até hoje
            </button>
            <button
              className="rounded-lg border border-forest/15 px-3 py-2 text-xs font-semibold text-forest hover:bg-mint"
              onClick={() => {
                const period = recentPeriod(today(), 7);
                setStart(period.start);
                setEnd(period.end);
              }}
            >
              Últimos 7 dias
            </button>
          </div>
        </div>
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
              label="Dias registrados"
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Target size={23} className="text-forest" aria-hidden="true" />
                Suas metas
              </h2>
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
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {goals.map((goal) => {
                  const status = goalSummary(records, goal);
                  return (
                    <div
                      key={goal.id}
                      className="border-t border-forest/10 pt-4"
                    >
                      <div className="flex flex-wrap justify-between gap-2 text-sm">
                        <p>
                          {dateLabel(goal.dataInicio)} a{" "}
                          {dateLabel(goal.dataFim)}
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
          <section
            id="historico"
            className="mb-8 scroll-mt-6"
            aria-label="Histórico de consumo"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Histórico do período</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Corrija registros ou baixe os dados do intervalo selecionado.
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary"
                disabled={!result.records.length}
                onClick={() => {
                  const url = URL.createObjectURL(
                    new Blob([consumptionCsv(result.records)], {
                      type: "text/csv;charset=utf-8",
                    }),
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `ecolar-consumos-${id}-${start}-${end}.csv`;
                  link.click();
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                }}
              >
                <Download size={16} aria-hidden="true" />
                Exportar período (CSV)
              </button>
            </div>
            {!result.records.length ? (
              <Empty
                title="Nenhum consumo neste intervalo"
                to={`/residencias/${id}/consumos/novo`}
                action="Registrar primeiro consumo"
              >
                Ajuste as datas ou registre um dia para começar a acompanhar.
              </Empty>
            ) : (
              <div className="grid gap-3">
                {[...result.records].reverse().map((record) => (
                  <article
                    key={record.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forest/10 bg-white px-5 py-4"
                  >
                    <div className="grid flex-1 gap-x-8 gap-y-1 sm:grid-cols-3 sm:items-center">
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
      <Analysis
        key={id}
        residenceId={id}
        latestDate={records.reduce(
          (latest, record) => record.data > latest ? record.data : latest,
          "",
        )}
      />
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
