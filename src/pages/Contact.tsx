import { useState } from "react";
import type { FormEvent } from "react";
import { z } from "zod";
import { Field, Notice, PageIntro } from "../components/ui";
import { fieldsFrom } from "../utils/validation";

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome.").max(100),
  email: z.email("Informe um e-mail válido."),
  mensagem: z
    .string()
    .trim()
    .min(10, "Escreva pelo menos 10 caracteres.")
    .max(2000, "Use até 2.000 caracteres."),
});
export default function Contact() {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const configuredEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();
  const email = z.email().safeParse(configuredEmail).success
    ? configuredEmail
    : undefined;
  const message = `Nome: ${form.nome}\nE-mail: ${form.email}\n\n${form.mensagem}`;
  function submit(event: FormEvent) {
    event.preventDefault();
    setNotice("");
    const result = schema.safeParse(form);
    setErrors(result.success ? {} : fieldsFrom(result.error));
    setReady(result.success);
  }
  async function copy() {
    setBusy(true);
    try {
      await navigator.clipboard.writeText(message);
      setNotice("Texto copiado. A mensagem ainda não foi enviada.");
    } catch {
      setNotice(
        "Não foi possível copiar automaticamente. Selecione o texto preparado abaixo e copie manualmente.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageIntro
        eyebrow="Contato"
        title="Fale com quem está construindo."
        description="Prepare sua mensagem para a equipe. O site não realiza envio automático nem armazena os dados deste formulário."
      />
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <form className="panel space-y-5" onSubmit={submit} noValidate>
          <Field
            id="contact-name"
            label="Nome"
            required
            autoComplete="name"
            maxLength={100}
            value={form.nome}
            error={errors.nome}
            onChange={(event) => {
              setReady(false);
              setForm({ ...form, nome: event.target.value });
            }}
          />
          <Field
            id="contact-email"
            label="E-mail para resposta"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            error={errors.email}
            onChange={(event) => {
              setReady(false);
              setForm({ ...form, email: event.target.value });
            }}
          />
          <div>
            <label
              className="mb-2 block text-sm font-semibold"
              htmlFor="contact-message"
            >
              Mensagem *
            </label>
            <textarea
              id="contact-message"
              className="input min-h-36"
              required
              maxLength={2000}
              aria-invalid={!!errors.mensagem}
              aria-describedby={errors.mensagem ? "contact-count contact-error" : "contact-count"}
              value={form.mensagem}
              onChange={(event) => {
                setReady(false);
                setForm({ ...form, mensagem: event.target.value });
              }}
            />
            <p id="contact-count" className="mt-2 text-sm text-slate-600">
              {form.mensagem.length} de 2.000 caracteres · mínimo de 10
            </p>
            {errors.mensagem && (
              <p id="contact-error" className="mt-2 text-sm text-red-700">
                {errors.mensagem}
              </p>
            )}
          </div>
          <button className="btn" type="submit">
            Preparar mensagem
          </button>
          {ready && (
            <div className="space-y-4">
              <Notice>
                Mensagem preparada. Escolha como continuar. Nenhum envio foi
                realizado.
              </Notice>
              <pre className="whitespace-pre-wrap break-words rounded-xl bg-paper p-4 font-sans text-sm">
                {message}
              </pre>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={busy}
                  className="btn-secondary"
                  onClick={copy}
                >
                  Copiar texto
                </button>
                {email && (
                  <a
                    className="btn"
                    href={`mailto:${email}?subject=${encodeURIComponent("Contato EcoLar")}&body=${encodeURIComponent(message)}`}
                  >
                    Abrir aplicativo de e-mail
                  </a>
                )}
              </div>
            </div>
          )}
          {notice && <Notice>{notice}</Notice>}
        </form>
        <aside className="space-y-5">
          <section className="rounded-2xl bg-forest p-7 text-white">
            <h2 className="text-2xl font-semibold">
              Uma conversa também melhora o projeto.
            </h2>
            <p className="mt-4 leading-relaxed text-white/80">
              Conte o que ficou confuso ou qual informação ajudaria no seu dia a
              dia. Não inclua senhas, documentos ou dados sensíveis.
            </p>
          </section>
          <section className="panel">
            <h2 className="font-semibold">Como sua mensagem chega</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {email
                ? `O botão abre seu aplicativo de e-mail para ${email}. Você revisa e confirma o envio por lá.`
                : "O canal de e-mail ainda será definido pela equipe. Por enquanto, copie a mensagem preparada e encaminhe pelo canal que vocês já utilizam."}
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
