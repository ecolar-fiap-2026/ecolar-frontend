import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  House,
  Zap,
  Leaf,
  ChartNoAxesCombined,
  Target,
  Calculator,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="grid items-center gap-12 py-5 lg:grid-cols-[1.15fr_1fr] lg:py-10">
        <div>
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-forest">
            <span className="h-2 w-2 rounded-full bg-forest" />
            Pequenas escolhas. Consumo consciente.
          </p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Entenda sua energia.
            <br />
            <span className="text-forest/60">Cuide do seu lar.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
            Transforme seus registros de consumo em informação para planejar
            gastos e repensar hábitos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn" to="/residencias">
              Começar a acompanhar
              <ArrowUpRight size={18} />
            </Link>
            <Link className="btn-secondary" to="/simulador">
              Explorar simulador
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-500">
            Sem sensores. Você informa os dados e acompanha a evolução.
          </p>
        </div>
        <div className="relative flex min-h-96 flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-forest px-6 py-9 text-white sm:min-h-[450px]">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-12 h-96 w-96 rounded-full border border-white/10" />
          <p className="relative mb-7 self-start text-xs uppercase tracking-[0.2em] text-leaf">
            Consciência começa em casa
          </p>
          <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-leaf/30 bg-white/5">
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-leaf text-forest">
              <House size={68} strokeWidth={1.4} aria-hidden="true" />
            </div>
            <span className="absolute -right-4 top-4 rounded-2xl bg-white p-4 text-forest">
              <Zap size={26} aria-hidden="true" />
            </span>
            <span className="absolute -left-4 bottom-3 rounded-2xl bg-[#e9efdd] p-4 text-forest">
              <Leaf size={26} aria-hidden="true" />
            </span>
          </div>
          <div className="relative mt-8 w-full border-t border-white/20 pt-5">
            <p className="text-xl font-medium">Cada registro conta.</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Conheça seu histórico antes de decidir o que mudar.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-14 border-t border-forest/15 pt-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-lg text-3xl font-semibold tracking-tight">
            Seu consumo, com mais clareza.
          </h2>
          <Link to="/sobre" className="text-link">
            Conheça o projeto
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              Icon: ChartNoAxesCombined,
              title: "Acompanhe seus registros",
              text: "Organize o consumo diário e veja o custo estimado com a tarifa informada.",
              tag: "01 · Histórico",
            },
            {
              Icon: Target,
              title: "Defina o seu objetivo",
              text: "Compare o que já foi registrado com uma meta, sem esconder dias que faltam.",
              tag: "02 · Metas",
            },
            {
              Icon: Calculator,
              title: "Experimente outros hábitos",
              text: "Simule o uso de um aparelho e entenda o efeito das horas de funcionamento.",
              tag: "03 · Simulação",
            },
          ].map(({ Icon, title, text, tag }) => (
            <article key={title} className="panel">
              <div className="mb-7 flex items-center justify-between">
                <Icon
                  size={28}
                  strokeWidth={1.5}
                  className="text-forest"
                  aria-hidden="true"
                />
                <span className="text-xs text-slate-500">{tag}</span>
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-12 flex flex-col justify-between gap-6 rounded-2xl bg-leaf/55 p-7 sm:p-9 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-forest/70">
            CitizenTech
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Tecnologia que começa nas pessoas.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-700">
            Um projeto acadêmico sobre informação acessível, eficiência
            energética e escolhas conscientes.
          </p>
        </div>
        <Link to="/integrantes" className="btn-secondary shrink-0">
          Conheça a equipe
          <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}
