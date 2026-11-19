import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  ClipboardPenLine,
  Leaf,
  Sun,
  Target,
} from "lucide-react";

const steps = [
  {
    Icon: ClipboardPenLine,
    title: "Registre",
    text: "Informe o consumo de cada dia.",
    detail: "Comece pela sua residência",
    to: "/residencias",
  },
  {
    Icon: ChartNoAxesColumnIncreasing,
    title: "Acompanhe",
    text: "Entenda os números da sua casa.",
    detail: "Conheça o passo a passo",
    to: "/como-funciona",
  },
  {
    Icon: Target,
    title: "Planeje",
    text: "Defina metas e repense hábitos.",
    detail: "Experimente o simulador",
    to: "/simulador",
  },
];

export default function Home() {
  return (
    <>
      <section className="grid items-center gap-6 pb-8 pt-2 lg:grid-cols-[1.05fr_1fr] lg:gap-2 lg:pb-10 lg:pt-4">
        <div className="relative z-10">
          <p className="mb-5 inline-flex rounded-full bg-gold/30 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#71500d]">
            Energia no dia a dia
          </p>
          <h1 className="max-w-xl text-[2rem] font-bold leading-[1.13] tracking-[-0.045em] sm:text-5xl xl:text-[3.4rem]">
            Entenda seu consumo.
            <br />
            <span className="text-forest">Faça escolhas conscientes.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
            Acompanhe a energia da sua casa, organize seus registros e defina
            metas que fazem sentido para você.
          </p>
          <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
            <Link className="btn" to="/residencias">
              Acessar painel <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="btn-secondary" to="/como-funciona">
              Como funciona
            </Link>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Leaf size={14} aria-hidden="true" /> Sem sensores. Um registro de
            cada vez.
          </p>
        </div>
        <figure className="relative mx-auto w-full max-w-[580px] lg:w-[108%] lg:max-w-none lg:justify-self-end">
          <img
            src="/images/casa-ecolar.webp"
            width="1448"
            height="1086"
            fetchPriority="high"
            alt="Casa com sala, cozinha e plantas: o cuidado com a energia começa nos hábitos de casa."
            className="relative w-full"
          />
        </figure>
      </section>
      <section
        aria-label="Três passos para começar"
        className="grid gap-6 rounded-2xl border border-forest/10 bg-white/70 px-5 py-6 md:grid-cols-3 md:gap-4 sm:px-7"
      >
        {steps.map(({ Icon, title, text, detail, to }, index) => (
          <Link
            key={title}
            to={to}
            className="group flex gap-4 rounded-lg focus-visible:outline-2"
          >
            <Icon
              className="mt-1 shrink-0 text-forest"
              size={32}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Passo 0{index + 1}
              </p>
              <h2 className="text-lg font-bold group-hover:text-forest">
                {title}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-forest">
                {detail}
                <ArrowRight size={13} aria-hidden="true" />
              </p>
            </div>
          </Link>
        ))}
      </section>
      <section className="mt-12 grid items-center gap-7 border-b border-forest/10 pb-10 lg:grid-cols-[1fr_1.2fr_1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-forest">
            Mais clareza, todos os dias
          </p>
          <h2 className="max-w-xs text-2xl font-bold leading-tight tracking-tight">
            Cuidar da sua casa começa por entender.
          </h2>
          <div className="mt-4 h-1 w-12 rounded-full bg-gold" />
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          O EcoLar é um projeto acadêmico CitizenTech que aproxima informação e
          consumo consciente. Você acompanha os dias registrados, estima custos
          e observa suas metas, sem confundir falta de dados com consumo zero.
        </p>
        <div className="flex gap-5 lg:justify-end">
          <div className="flex max-w-36 items-start gap-2">
            <span className="rounded-lg bg-[#f4c44d] p-2 text-[#5b430b]">
              <Sun size={24} aria-hidden="true" />
            </span>
            <p className="text-xs leading-relaxed">
              <strong className="block">ODS 7</strong>Energia acessível e limpa
            </p>
          </div>
          <div className="flex max-w-36 items-start gap-2">
            <span className="rounded-lg bg-[#e6b06d] p-2 text-[#66400d]">
              <Leaf size={24} aria-hidden="true" />
            </span>
            <p className="text-xs leading-relaxed">
              <strong className="block">ODS 12</strong>Consumo e produção
              responsáveis
            </p>
          </div>
        </div>
      </section>
      <section className="mt-9 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold">
            Quer começar com uma pequena mudança?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Compare o tempo de uso de um aparelho no simulador gratuito.
          </p>
        </div>
        <Link to="/simulador" className="text-link shrink-0">
          Simular meu consumo <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
