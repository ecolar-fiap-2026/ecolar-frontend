import { Link } from "react-router-dom";
import {
  ArrowRight,
  House,
  ClipboardPenLine,
  ChartNoAxesColumnIncreasing,
  Target,
} from "lucide-react";
import { Notice, PageIntro } from "../components/ui";

const steps = [
  {
    Icon: House,
    title: "Crie o espaço da sua casa",
    text: "Em Minhas residências, informe um nome, a quantidade de moradores e a tarifa por kWh. Nesta versão acadêmica, use dados fictícios. Depois, escolha Abrir painel.",
  },
  {
    Icon: ClipboardPenLine,
    title: "Registre o que foi consumido no dia",
    text: "No painel, escolha Registrar consumo. Informe a data, o consumo em kWh e a origem. O número acumulado que aparece no medidor não é o consumo diário: calcule a diferença entre duas leituras de dias consecutivos.",
  },
  {
    Icon: ChartNoAxesColumnIncreasing,
    title: "Acompanhe um período",
    text: "Escolha as datas no painel. Veja o total registrado, o custo estimado, o gráfico e os dias com informação. No histórico, você pode corrigir ou excluir um registro.",
  },
  {
    Icon: Target,
    title: "Defina uma meta possível",
    text: "Em Metas, escolha início, fim e um limite de consumo em kWh. Acompanhe o progresso no painel. Se faltarem dias, o resultado continua parcial: não significa que a meta foi cumprida.",
  },
];
export default function HowItWorks() {
  return (
    <>
      <PageIntro
        eyebrow="Seu primeiro passo"
        title="É simples começar a entender."
        description="Você informa os dados. O EcoLar organiza os registros para ajudar nas suas escolhas."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {steps.map(({ Icon, title, text }, index) => (
          <article key={title} className="panel">
            <div className="mb-5 flex items-center justify-between">
              <Icon
                size={30}
                strokeWidth={1.6}
                className="text-forest"
                aria-hidden="true"
              />
              <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">
                Passo 0{index + 1}
              </span>
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {text}
            </p>
          </article>
        ))}
      </div>
      <section className="my-8 rounded-2xl bg-mint p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-forest">
          Um exemplo para entender
        </p>
        <h2 className="mt-3 text-xl font-semibold">
          Leitura do medidor é diferente de consumo.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
          Se ontem o medidor marcava 1.000 kWh e hoje marca 1.007,5 kWh, o
          consumo entre essas leituras foi de <strong>7,5 kWh</strong>. Para um
          registro diário, use leituras de dias consecutivos, no mesmo horário.
          Não distribua uma leitura mensal igualmente entre os dias como se
          fosse uma medição diária.
        </p>
        <Link to="/simulador" className="text-link mt-3">
          Experimentar o simulador <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
      <Notice>
        O cadastro e o histórico precisam do serviço de dados disponível.
        Enquanto isso, o simulador permite comparar cenários no navegador. Ele
        não salva consumos e não comprova integração com o banco.
      </Notice>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link to="/residencias" className="btn">
          Acessar minhas residências <ArrowRight size={17} aria-hidden="true" />
        </Link>
        <Link to="/simulador" className="btn-secondary">
          Experimentar o simulador
        </Link>
        <Link to="/faq" className="text-link">
          Ainda tenho dúvidas
        </Link>
      </div>
    </>
  );
}
