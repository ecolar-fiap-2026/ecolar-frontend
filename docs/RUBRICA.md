# Leitura do enunciado e mapa da entrega

Fonte principal: `1TDS Fevereiro - Global Solution 2026-2(2).pdf`, 100 páginas. Os números abaixo são as páginas físicas do PDF, começando pela capa; não confundir com contadores internos como “16/16”, pois o próprio PDF acrescenta uma página “17/17” de Front.

Leitura cruzada: EcoLar — guia (23 p.), Business Model (31 p.), documentação Python (12 p.) e Texto colado. Este documento orienta Front e suas dependências; não substitui os ZIPs e rubricas das outras disciplinas.

## 1. O que vale nota em Front

| Bloco | Pontos | Implementação / evidência necessária |
| --- | ---: | --- |
| Construção | 10 | React + Vite + TypeScript; SPA própria; organização de arquivos; execução e código compreensível |
| Componentes, páginas e rotas | 10 | Cinco institucionais + duas da solução; rotas estáticas e parametrizada; ao menos dois componentes próprios reaproveitados em dois lugares |
| Tailwind, CSS e responsividade | 8 | Tailwind principal; integridade visual em 390×844, 768×1024, 1440×900 |
| API Java | 18 | Fetch; tipos; GET real; escrita real; estados de carregamento/erro/vazio; dados da API na interface |
| Formulários e UX | 7 | Campos adequados; validação; mensagens de erro e sucesso; feedback das operações |
| Vercel | 7 | URL pública acessível; navegação e recarga de rotas; API funcionando remotamente |
| GitHub, README e vídeo | 10 | Repositório público; 5 commits/pessoa e 15 no total; README completo; YouTube até 3 minutos |
| Apresentação presencial | 30 | Domínio técnico, demonstração e participação efetiva de todos |
| Total | 100 | Entrega 70 + apresentação 30 |

Referência: pp. 58–74; detalhamento de pontuação pp. 64–72. A existência de código para um requisito não comprova sua execução remota nem assegura a pontuação.

## 2. Rotas e responsabilidades implementadas

| Rota | Finalidade |
| --- | --- |
| / | Home e entrada na jornada |
| /integrantes | Nomes, RMs e participação |
| /sobre | Problema, proposta, escopo, limites e ODS |
| /faq | Dúvidas frequentes e regras explicadas |
| /contato | Formulário validado, preparação de texto e contato configurável |
| /residencias | Listagem, cadastro, edição e remoção |
| /residencias/:id | Painel, histórico, indicadores, filtro e análises |
| /residencias/:id/consumos/novo | Registro diário |
| /residencias/:id/consumos/:consumoId/editar | Correção do registro |
| /residencias/:id/metas | Cadastro, edição, remoção e acompanhamento de metas |
| /simulador | Comparação matemática de cenários de uso |
| * | Página de rota inexistente |

`PageIntro`, `Field`, `Notice`, `RemoteError`, `Empty`, `Loading` e outros componentes têm uso real em múltiplas páginas. Services centralizam Fetch e contratos; pages cuidam dos fluxos; types definem os dados; utils isolam cálculos e validação. Tailwind usa abordagem mobile-first, com reorganização progressiva em breakpoints. As três dimensões do enunciado são resoluções de teste, não três páginas separadas.

## 3. O que pode tirar pontos ou zerar

| Ocorrência no Front | Consequência expressa no PDF, p. 73 |
| --- | --- |
| ZIP maior que 50 MB | −2 |
| node_modules dentro do ZIP | −3 |
| Arquivos essenciais ausentes | −10 |
| Axios/outra biblioteca substituindo Fetch | −10 |
| Entregar somente links, sem ZIP no Portal | Nota zero |
| Template/tema/projeto pronto como base substancial | Nota zero |
| Angular, Vue, Next.js, Create React App ou substituição da stack exigida | Nota zero |
| Projeto incompatível com a proposta ou stack | Nota zero |
| Plágio/trabalho substancialmente idêntico | Nota zero + ocorrência |

Este código foi produzido especificamente para EcoLar, com apoio de IA declarado. O enunciado autoriza IA como apoio, mas exige revisão, adaptação e domínio do grupo (p. 17). A entrega automática sem compreensão continua sendo um risco acadêmico. Não importar tema pronto nem atribuir autoria falsa aos colegas.

Outras ausências perdem os pontos dos respectivos critérios. Exemplos: API mockada não satisfaz integração Java; vídeo privado impede avaliação; link quebrado não comprova deploy; commits concentrados em uma pessoa não atendem cinco por integrante. Não tratar os 30 pontos presenciais como garantidos pelo PPTX.

## 4. Arquitetura de integração obrigatória

Front (React/Vite/TS/Tailwind, Vercel) → Fetch/JSON → Java Spring Boot (Render) → DAO/JDBC → Oracle FIAP.

Referência Java pp. 47–56. Pacotes exigidos: model, dao, dto, controller, exception, handler, config. Service é opcional. DataSource por construtor, PreparedStatement, DTOs de entrada/saída, ModelMapper, Bean Validation/@Valid e tratamento global @RestControllerAdvice. No mínimo três entidades, CRUD completo e relacionamento 1:N com endpoints aninhados. Docker multi-stage e publicação remota. Não usar JPA/Hibernate/Spring Data em lugar de JDBC.

Java precisa devolver os status corretos, incluindo criação 201 + Location, consulta/edição 200, exclusão 204, entradas inválidas 400, ausente 404, método indevido 405, conflito 409 e erro inesperado 500 sem detalhes internos. Oracle e credenciais nunca vão para o navegador ou para variáveis VITE_. A API remota exige CORS para a origem da Vercel e ambiente local.

Residencia → muitos ConsumoDiario e MetaConsumo. O contrato anexado a esta base é proposto: o Java existente é quem precisa ser inspecionado e alinhado. Um esquema OpenAPI proposto não significa endpoint publicado.

Para IA, a arquitetura proposta é Java → Flask → dois modelos treinados/exportados. A documentação de AI da GS precisa de notebook, métricas e aplicação; respostas fixas não provam modelo. A janela de sete dias consta da proposta EcoLar, mas depende das features e do treinamento real de Yan. Python procedural continua um módulo separado, usando JSON, conforme a documentação entregue; não é requisito ligar o script Python diretamente ao front.

## 5. Decisões de escopo extraídas dos anexos

- MVP sem autenticação, pagamento, CPF, endereço real ou integração com medidor. Usar dados fictícios na demonstração pública.
- Fluxo prioritário: residência, consumo diário e meta. Cadastro de aparelhos, login e sugestões automáticas amplas apareciam na ideia inicial; não são tratados como concluídos.
- Consumo em kWh/dia; tarifa R$/kWh. Zero registrado é diferente de ausência. Indicadores mostram a cobertura dos registros; não anunciam meta cumprida com histórico parcial.
- Simulador web é cálculo, não IA e não o programa Python. Sua fórmula nominal não representa automaticamente a conta completa com impostos, bandeiras e taxas.
- Modelo de negócio mais recente: hipótese B2C de R$ 10,90/mês, com MVP acadêmico gratuito. O guia anterior falava em B2B2C; não apresentar os dois como decisão final simultânea.
- Economia e ROI são cenários, não resultados medidos do EcoLar. Benefício precisa ser testado com usuários e base comparável.
- Identificação utilizada: Vinicius Pacheco Ruiz, RM 571109; Yan Almeida, RM 568814; Diego Barbosa, RM 568829; 1TDSPV, segundo documentação Python. Conferir grafia, turma e cadastro do grupo antes da entrega.

## 6. Defesa presencial de Front

| Critério, p. 71 | Pontos | Evidência na fala/demonstração |
| --- | ---: | --- |
| Problema | 3 | Cidadão, dor e motivação |
| Solução | 3 | Benefício, escopo e limites |
| Páginas e navegação | 3 | Mostrar cinco institucionais, solução e URL parametrizada |
| Responsividade | 3 | Demonstrar as três resoluções sem cortes |
| JS, formulário e comportamento | 3 | Entrada inválida, feedback e fluxo correto |
| Domínio de HTML/CSS/JS — ocorrência 1 | 4 | Explicar semântica, layout e lógica |
| Domínio de HTML/CSS/JS — ocorrência 2 | 4 | O PDF repete literalmente esse critério; não inventamos outra categoria |
| Participação | 4 | Os três apresentam e respondem |
| Perguntas | 3 | Explicar decisões e limitações |

A repetição do critério no PDF soma 8 pontos e mantém total 30. Peçam ao professor apenas a interpretação dessa duplicidade; preparem domínio integral independentemente da resposta. O PDF não define aqui um tempo único para a apresentação oral de Front. O roteiro de ensaio propõe 8–10 minutos, ajustável ao tempo que ele indicar.

## 7. Prazos e sequência até o Portal

Prazo final: 19/11/2026 às 23h55. Apresentações entre 23 e 27/11, na aula correspondente. Cadastro dos grupos tinha prazo em 13/11; em 15/11 ele já passou: confirmar no Portal que o grupo está registrado. Não supor que criar organização GitHub cadastra o grupo na FIAP.

| Data sugerida | Resultado concreto | Responsáveis |
| --- | --- | --- |
| 15/11 | Confirmar grupo, criar organização/repo, abrir base no Windows, alinhar DTOs | Todos; Diego fornece Java |
| 16/11 | Java/Oracle remoto e GET + escrita no front; contribuições reais | Diego e Vinicius |
| 17/11 | Metas, erros, responsividade com dados; IA se pronta | Todos; Yan nas análises |
| 18/11 | Vercel, recarga de rotas, gravações, README e links públicos | Todos |
| 19/11 até 20h | Revisão cruzada, ZIP limpo, envio pelo representante e comprovante | Todos / representante |
| 20–22/11 | Ensaiar e revisar perguntas; manter URLs disponíveis | Todos |

20h é uma margem recomendada, não mudança do prazo oficial. Para Front, enviar um ZIP com código e documentação. Não confundir com o ZIP Java ou o PDF de Negócios.

## 8. Pontos de atenção nas demais disciplinas

O pitch de Negócios permite até 5 minutos; o vídeo Java, até 5; o vídeo Front, até 3. Não usar um vídeo de 5 minutos como única evidência de Front. Negócios pede backlog Jira/Trello público e atualizado, PDF completo com diagramas, fontes, ROI, SLA e registro de IA. GitHub Projects não substitui o backlog explicitamente exigido. O documento EcoLar de Negócios ainda traz campos de links/identificação a concluir.

A defesa de Negócios distribui 100 pontos próprios: backlog/evolução 15, negócio/mercado 15, viabilidade 20, modelagem 20, demonstração/UX 15, domínio/participação 15; esse resultado pesa 30% da GS da disciplina. Abrir o backlog real e explicar um caso de uso e sua atividade é necessário; slides sozinhos não bastam.

Banco tem referência a 50 registros em um trecho e 60 em outro: usar ao menos 60 registros coerentes evita depender da interpretação menos exigente. Front não obriga CRUD para todas as sete tabelas da proposta. A integração deve preservar chaves, unidades e regras do banco.

## 9. O que ainda impede dizer “pronto para entregar”

Faltam URL/código/DTOs definitivos do Java; execução remota até Oracle; evidência das duas análises reais; organização e commits efetivos; contato oficial; Vercel; vídeos publicados; revisão humana e confirmação de identidade/cadastro. A base de Front, testes locais e materiais estão preparados. Não foram criadas contas, convites ou publicações, nem enviados trabalhos ao Portal.
