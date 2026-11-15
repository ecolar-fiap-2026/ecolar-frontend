import { Link } from "react-router-dom";
import { PageIntro } from "../components/ui";

export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="Sobre o EcoLar"
        title="Informação que cabe na rotina."
        description="A proposta é ajudar o responsável pelo orçamento doméstico a entender seus registros de energia, planejar metas e avaliar cenários de uso."
      />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section className="panel">
          <h2 className="text-2xl font-semibold">Como funciona</h2>
          <ol className="mt-6 space-y-7">
            {[
              [
                "Cadastre uma residência",
                "Informe um nome fictício, quantidade de moradores e tarifa por kWh.",
              ],
              [
                "Registre o consumo diário",
                "Use a energia consumida no dia, em kWh. Uma leitura acumulada do medidor precisa ser convertida em diferença entre leituras.",
              ],
              [
                "Acompanhe o período",
                "Veja o histórico, a cobertura dos registros e a comparação com uma meta.",
              ],
              [
                "Explore possibilidades",
                "Simule aparelhos. Quando o serviço de IA estiver conectado, solicite previsão e análise de padrões.",
              ],
            ].map(([title, text], index) => (
              <li className="flex gap-4" key={title}>
                <span className="text-lg font-semibold text-forest/50">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <div className="space-y-6">
          <section className="rounded-2xl bg-forest p-7 text-white">
            <h2 className="text-2xl font-semibold">O cidadão no centro</h2>
            <p className="mt-4 leading-relaxed text-white/80">
              O EcoLar se conecta à proposta CitizenTech ao transformar dados
              cotidianos em informação compreensível.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Contribuição proposta aos ODS 7.3, eficiência energética, e 12.8,
              informação para o consumo responsável. O impacto ainda precisa ser
              medido com usuários.
            </p>
          </section>
          <section className="panel">
            <h2 className="text-xl font-semibold">Limites da proposta</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-600">
              <li>
                O protótipo usa dados fictícios e não possui autenticação.
              </li>
              <li>Não há leitura automática de sensores ou faturas.</li>
              <li>Custos não incluem tributos, bandeiras e cobranças fixas.</li>
              <li>Previsão é estimativa. O sistema não garante economia.</li>
            </ul>
            <Link className="text-link mt-4" to="/faq">
              Tire suas dúvidas
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
