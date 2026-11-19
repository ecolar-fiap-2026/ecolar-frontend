import { Link } from "react-router-dom";
import { PageIntro } from "../components/ui";
import { team } from "../data/team";

export default function Team() {
  return (
    <>
      <PageIntro
        eyebrow="Quem constrói"
        title="Três pessoas. Um propósito."
        description="Conheça os integrantes do EcoLar, projeto da turma 1TDSPV de Análise e Desenvolvimento de Sistemas da FIAP."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {team.map((member) => (
          <article className="panel" key={member.rm}>
            <div
              className="mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-leaf/70 text-2xl font-medium text-forest"
              aria-hidden="true"
            >
              {member.initials}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              RM {member.rm} · 1TDSPV
            </p>
            <h2 className="mt-3 text-2xl font-semibold">{member.name}</h2>
            <p className="mt-3 font-medium text-forest">{member.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {member.detail}
            </p>
            {member.github && (
              <a
                className="text-link mt-5"
                href={member.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub de Vinicius
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            )}
          </article>
        ))}
      </div>
      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-slate-600">
        A equipe compartilha a revisão, os testes e a apresentação. Cada frente
        contribui para a mesma jornada: registrar, compreender e acompanhar o
        consumo residencial.
      </p>
      <Link className="text-link mt-4" to="/contato">
        Enviar uma mensagem à equipe
      </Link>
    </>
  );
}
