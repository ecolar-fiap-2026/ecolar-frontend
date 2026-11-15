import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, House, Pencil, Trash2 } from "lucide-react";
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
import type { Residence } from "../types/domain";
import { decimal, fieldsFrom, residenceInput } from "../utils/validation";
import { number } from "../utils/energy";

const blank = { nome: "", quantidadeMoradores: "", tarifaKwh: "" };
export default function Residences() {
  const remote = useRemote(api.residences);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<number>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [failure, setFailure] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<Residence>();
  function reset() {
    setForm(blank);
    setEditing(undefined);
    setErrors({});
  }
  function edit(residence: Residence) {
    setForm({
      nome: residence.nome,
      quantidadeMoradores: String(residence.quantidadeMoradores),
      tarifaKwh: String(residence.tarifaKwh),
    });
    setEditing(residence.id);
    setErrors({});
    setFeedback("");
    setFailure("");
    document
      .getElementById("residence-form")
      ?.scrollIntoView({ block: "start", behavior: "smooth" });
    document.getElementById("residence-name")?.focus({ preventScroll: true });
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setFeedback("");
    setFailure("");
    const parsed = residenceInput.safeParse({
      nome: form.nome,
      quantidadeMoradores: decimal(form.quantidadeMoradores),
      tarifaKwh: decimal(form.tarifaKwh),
    });
    if (!parsed.success) {
      setErrors(fieldsFrom(parsed.error));
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await api.saveResidence(parsed.data, editing);
      setFeedback(
        editing
          ? "Residência atualizada com sucesso."
          : "Residência cadastrada com sucesso. Abra o painel para registrar o consumo.",
      );
      reset();
      remote.reload();
    } catch (cause) {
      setFailure(errorMessage(cause));
      if (cause instanceof ApiError) setErrors(cause.fields);
    } finally {
      setSaving(false);
    }
  }
  async function remove() {
    if (!removing) return;
    setSaving(true);
    setFailure("");
    setFeedback("");
    try {
      await api.deleteResidence(removing.id);
      if (editing === removing.id) reset();
      setFeedback("Residência removida.");
      remote.reload();
    } catch (cause) {
      setFailure(errorMessage(cause));
    } finally {
      setSaving(false);
      setRemoving(undefined);
    }
  }
  return (
    <>
      <PageIntro
        eyebrow="Seu espaço"
        title="Minhas residências"
        description="Organize os registros por residência. Nesta versão acadêmica, utilize nomes e dados fictícios."
      />
      <div className="mb-6 space-y-3">
        {feedback && <Notice kind="success">{feedback}</Notice>}
        {failure && <Notice kind="error">{failure}</Notice>}
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section aria-label="Residências cadastradas" className="space-y-5">
          {remote.loading ? (
            <Loading />
          ) : remote.error ? (
            <RemoteError message={remote.error} retry={remote.reload} />
          ) : remote.data?.length ? (
            remote.data.map((residence) => (
              <article key={residence.id} className="panel">
                <div className="flex items-start gap-4">
                  <span className="rounded-xl bg-leaf/60 p-3 text-forest">
                    <House aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="break-words text-xl font-semibold">
                      {residence.nome}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {residence.quantidadeMoradores} moradores · R${" "}
                      {number(residence.tarifaKwh, 4)}/kWh
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-forest/10 pt-4">
                  <Link
                    to={`/residencias/${residence.id}`}
                    className="text-link"
                  >
                    Abrir painel
                    <ArrowUpRight size={18} />
                  </Link>
                  <div className="flex gap-1">
                    <button
                      className="btn-secondary px-3"
                      aria-label={`Editar ${residence.nome}`}
                      onClick={() => edit(residence)}
                      disabled={saving}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-secondary px-3 text-red-700"
                      aria-label={`Excluir ${residence.nome}`}
                      onClick={() => setRemoving(residence)}
                      disabled={saving}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <Empty title="Sua primeira residência começa aqui">
              Preencha o formulário para começar. Nenhum consumo será criado
              automaticamente.
            </Empty>
          )}
        </section>
        <form
          id="residence-form"
          onSubmit={submit}
          noValidate
          className="panel space-y-5"
        >
          <div>
            <h2 className="text-xl font-semibold">
              {editing ? "Editar residência" : "Cadastrar residência"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Os campos com * são obrigatórios.
            </p>
          </div>
          <Field
            label="Nome da residência"
            id="residence-name"
            required
            maxLength={100}
            placeholder="Ex.: Casa de demonstração"
            value={form.nome}
            error={errors.nome}
            onChange={(event) => setForm({ ...form, nome: event.target.value })}
          />
          <Field
            label="Quantidade de moradores"
            id="residence-people"
            required
            inputMode="numeric"
            value={form.quantidadeMoradores}
            error={errors.quantidadeMoradores}
            onChange={(event) =>
              setForm({ ...form, quantidadeMoradores: event.target.value })
            }
          />
          <Field
            label="Tarifa informada (R$/kWh)"
            id="residence-tariff"
            required
            inputMode="decimal"
            placeholder="Ex.: 0,90"
            hint="Valor usado na estimativa. Não representa o valor final da fatura."
            value={form.tarifaKwh}
            error={errors.tarifaKwh}
            onChange={(event) =>
              setForm({ ...form, tarifaKwh: event.target.value })
            }
          />
          <div className="flex flex-wrap gap-3">
            <button className="btn" disabled={saving}>
              {saving
                ? "Salvando…"
                : editing
                  ? "Salvar alterações"
                  : "Cadastrar residência"}
            </button>
            {editing && (
              <button
                type="button"
                className="btn-secondary"
                onClick={reset}
                disabled={saving}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      <ConfirmDialog
        open={!!removing}
        title="Excluir residência?"
        description={`A residência ${removing?.nome || ""} será removida. Se houver consumos ou metas vinculados, o serviço deve impedir a exclusão.`}
        busy={saving}
        onCancel={() => setRemoving(undefined)}
        onConfirm={remove}
      />
    </>
  );
}
