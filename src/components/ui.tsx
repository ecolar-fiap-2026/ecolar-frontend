import { useEffect, useRef } from "react";
import type {
  ReactNode,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-forest/70">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 leading-relaxed text-slate-600">{description}</p>
      </div>
      {children}
    </div>
  );
}
export function Notice({
  children,
  kind = "info",
}: {
  children: ReactNode;
  kind?: "info" | "error" | "success";
}) {
  const colors =
    kind === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : kind === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
        : "border-forest/15 bg-forest/5 text-forest";
  const Icon = kind === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={`flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${colors}`}
    >
      <Icon aria-hidden="true" size={20} className="mt-0.5 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
export function Loading() {
  return (
    <div role="status" className="panel flex items-center gap-3 text-slate-600">
      <LoaderCircle className="animate-spin" aria-hidden="true" size={22} />
      Consultando dados…
    </div>
  );
}
export function RemoteError({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <div className="space-y-4">
      <Notice kind="error">{message}</Notice>
      <button className="btn-secondary" onClick={retry}>
        Tentar novamente
      </button>
    </div>
  );
}
export function Empty({
  title,
  children,
  to,
  action,
}: {
  title: string;
  children: ReactNode;
  to?: string;
  action?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-forest/25 bg-white p-8 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
        {children}
      </p>
      {to && (
        <Link className="btn mt-5" to={to}>
          {action}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
export function Field({
  label,
  error,
  hint,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
        {props.required && (
          <span className="ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        className={`input ${error ? "border-red-600" : ""}`}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...props}
      />
      {hint && (
        <p
          id={`${id}-hint`}
          className="mt-2 text-xs leading-relaxed text-slate-600"
        >
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
export function SelectField({
  label,
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <select id={id} className="input" {...props}>
        {children}
      </select>
    </div>
  );
}
export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="panel">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-3 break-words text-3xl font-semibold tracking-tight">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </div>
  );
}
export function ConfirmDialog({
  open,
  title,
  description,
  busy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl bg-white p-7 text-ink shadow-xl backdrop:bg-forest/40"
    >
      <h2 id="confirm-title" className="text-xl font-semibold">
        {title}
      </h2>
      <p className="my-5 text-sm leading-relaxed text-slate-600">
        {description}
      </p>
      <div className="flex flex-wrap justify-end gap-3">
        <button
          className="btn-secondary"
          onClick={onCancel}
          disabled={busy}
          autoFocus
        >
          Cancelar
        </button>
        <button className="btn-danger" disabled={busy} onClick={onConfirm}>
          {busy ? "Removendo…" : "Confirmar exclusão"}
        </button>
      </div>
    </dialog>
  );
}
