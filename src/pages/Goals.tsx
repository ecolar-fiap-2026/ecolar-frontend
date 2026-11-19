import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ConfirmDialog,
  Empty,
  Field,
  Loading,
  Notice,
  PageIntro,
  RemoteError,
} from "../components/ui";
import { useRemote } from "../hooks/useRemote";
import { api } from "../services/ecolar";
import { ApiError, errorMessage } from "../services/http";
import type { Goal } from "../types/domain";
import { dateLabel, number, today } from "../utils/energy";
import { decimal, fieldsFrom, goalInput, routeId } from "../utils/validation";
import NotFound from "./NotFound";

export default function Goals() {
  const id = routeId(useParams().id);
  return id ? <GoalManager key={id} id={id} /> : <NotFound />;
}
function GoalManager({ id }: { id: number }) {
  const loader = useCallback(
    async (signal: AbortSignal) => {
      const [residence, goals] = await Promise.all([
        api.residence(id, signal),
        api.goals(id, signal),
      ]);
      return { residence, goals };
    },
    [id],
  );
  const remote = useRemote(loader);
  const [form, setForm] = useState({
    dataInicio: today(),
    dataFim: today(),
    limiteKwh: "",
  });
  const [editing, setEditing] = useState<number>();
  const [removing, setRemoving] = useState<Goal>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  function reset() {
    setEditing(undefined);
    setForm({ dataInicio: today(), dataFim: today(), limiteKwh: "" });
    setErrors({});
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const parsed = goalInput.safeParse({
      ...form,
      limiteKwh: decimal(form.limiteKwh),
    });
    if (!parsed.success) {
      setErrors(fieldsFrom(parsed.error));
      return;
    }
    if (
      remote.data?.goals.some(
        (goal) =>
          goal.id !== editing &&
          parsed.data.dataInicio <= goal.dataFim &&
          parsed.data.dataFim >= goal.dataInicio,
      )
    ) {
      setError(
        "Já existe uma meta que abrange parte desse intervalo. Edite a meta existente ou escolha outro período.",
      );
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      await api.saveGoal(id, parsed.data, editing);
      setSuccess(
        "Meta salva com sucesso. Consulte o acompanhamento no painel.",
      );
      reset();
      remote.reload();
    } catch (cause) {
      setError(errorMessage(cause));
      if (cause instanceof ApiError) setErrors(cause.fields);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!removing) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await api.deleteGoal(removing.id);
      if (editing === removing.id) reset();
      setSuccess("Meta removida.");
      remote.reload();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
      setRemoving(undefined);
    }
  }
  return (
    <>
      <Link className="text-link mb-6" to={`/residencias/${id}`}>
        Voltar ao painel
      </Link>
      <PageIntro
        eyebrow={remote.data?.residence.nome || "Residência"}
        title="Metas de consumo"
        description="Escolha um intervalo e um limite em kWh. Períodos de metas da mesma residência não podem se sobrepor."
      />
      {error && (
        <div className="mb-5">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      {success && (
        <div className="mb-5">
          <Notice kind="success">{success}</Notice>
        </div>
      )}
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <section className="space-y-4" aria-label="Metas cadastradas">
          {remote.loading ? (
            <Loading />
          ) : remote.error ? (
            <RemoteError message={remote.error} retry={remote.reload} />
          ) : remote.data?.goals.length ? (
            remote.data.goals.map((goal) => (
              <article className="panel" key={goal.id}>
                <h2 className="text-2xl font-semibold">
                  {number(goal.limiteKwh)} kWh
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {dateLabel(goal.dataInicio)} a {dateLabel(goal.dataFim)}
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    className="btn-secondary"
                    disabled={busy}
                    onClick={() => {
                      setEditing(goal.id);
                      setForm({
                        dataInicio: goal.dataInicio,
                        dataFim: goal.dataFim,
                        limiteKwh: String(goal.limiteKwh),
                      });
                      setErrors({});
                      document.getElementById("goal-start")?.focus();
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-secondary text-red-700"
                    disabled={busy}
                    onClick={() => setRemoving(goal)}
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))
          ) : (
            <Empty title="Uma meta para começar">
              Defina um limite que faça sentido para o período que você deseja
              acompanhar.
            </Empty>
          )}
        </section>
        <form onSubmit={submit} noValidate className="panel space-y-5">
          <h2 className="text-xl font-semibold">
            {editing ? "Editar meta" : "Definir meta"}
          </h2>
          <Field
            id="goal-start"
            label="Início"
            required
            type="date"
            value={form.dataInicio}
            error={errors.dataInicio}
            onChange={(event) =>
              setForm({ ...form, dataInicio: event.target.value })
            }
          />
          <Field
            id="goal-end"
            label="Fim da meta"
            min={form.dataInicio || undefined}
            hint="Escolha o mesmo dia do início ou uma data posterior."
            required
            type="date"
            value={form.dataFim}
            error={errors.dataFim}
            onChange={(event) =>
              setForm({ ...form, dataFim: event.target.value })
            }
          />
          <Field
            id="goal-limit"
            label="Limite de consumo (kWh)"
            required
            inputMode="decimal"
            placeholder="Ex.: 180"
            value={form.limiteKwh}
            error={errors.limiteKwh}
            onChange={(event) =>
              setForm({ ...form, limiteKwh: event.target.value })
            }
          />
          <div className="flex flex-wrap gap-3">
            <button className="btn" disabled={busy || !remote.data}>
              {busy ? "Salvando…" : "Salvar meta"}
            </button>
            {editing && (
              <button
                className="btn-secondary"
                type="button"
                disabled={busy}
                onClick={reset}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      <ConfirmDialog
        open={!!removing}
        title="Excluir meta?"
        description="A meta será removida. Os registros diários de consumo serão preservados."
        busy={busy}
        onCancel={() => setRemoving(undefined)}
        onConfirm={remove}
      />
    </>
  );
}
