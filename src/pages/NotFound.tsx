import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="mx-auto max-w-lg py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-forest/60">
        Página não encontrada
      </p>
      <h1 className="mt-4 text-4xl font-semibold">Vamos voltar ao caminho?</h1>
      <p className="my-6 leading-relaxed text-slate-600">
        O endereço pode estar incorreto ou ter sido alterado. Você pode começar
        pela página inicial.
      </p>
      <Link className="btn" to="/">
        Voltar ao início
      </Link>
    </section>
  );
}
