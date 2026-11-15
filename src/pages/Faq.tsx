import { Link } from "react-router-dom";
import { PageIntro } from "../components/ui";
import { questions } from "../data/faq";

export default function Faq() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageIntro
        eyebrow="Dúvidas frequentes"
        title="Vamos deixar tudo mais claro."
        description="Entenda as unidades, os registros e os limites das estimativas antes de começar."
      />
      <div className="divide-y divide-forest/15 border-y border-forest/15">
        {questions.map(([question, answer]) => (
          <details key={question} className="group py-5">
            <summary className="py-2 pr-4 text-base font-semibold focus-visible:outline-2 focus-visible:outline-forest">
              {question}
            </summary>
            <p className="mt-3 pr-4 text-sm leading-7 text-slate-600">
              {answer}
            </p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-sm">
        Ainda precisa de ajuda?{" "}
        <Link className="text-link" to="/contato">
          Fale com a equipe.
        </Link>
      </p>
    </div>
  );
}
