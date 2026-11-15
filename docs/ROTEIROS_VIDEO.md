# Gravação, edição e apresentação do EcoLar

Estes são roteiros de produção. Nenhum vídeo foi gravado ou publicado nesta preparação. As falas de integração abaixo só devem ser usadas depois de o grupo executar os testes reais e registrar as evidências. Não montar cenas que aparentem uma gravação bem-sucedida se a API ainda estiver indisponível.

## 1. Três entregas com objetivos diferentes

| Vídeo | Limite do enunciado | Meta de edição | Onde mostrar o link |
| --- | --- | --- | --- |
| Front | 3 minutos | 2min45 a 2min55 | README e entrega Front |
| Java | 5 minutos | 4min30 | README da API e entrega Java |
| Pitch de Negócios | 5 minutos | 4min40 | PDF e entrega de Negócios |

Front: YouTube público ou não listado. Java: YouTube não listado. Pitch: YouTube público/não listado ou Drive aberto; usar YouTube atende à preferência do grupo. Testar acesso sem a conta proprietária. Público não é o mesmo que privado.

## 2. Preparar a demonstração

1. Homologar Vercel → Java → Oracle antes de gravar. Deixar uma residência fictícia, alguns consumos e uma meta. Para IA, preparar a janela exigida pelo modelo real. Não inserir dados falsos diretamente no frontend.
2. Abrir abas: aplicação Vercel; GitHub; Network do navegador; código no VS Code; consulta Oracle/Swagger para Java; Jira/Trello e PDF para Negócios. Fechar contas, e-mails e conversas pessoais.
3. Organizar uma tela de 1920×1080 para gravação em 16:9, 30 fps. Isso é configuração de vídeo, não substitui demonstrar as resoluções da rubrica. Ampliar o código/Network para ficar legível em celular.
4. Gravar voz real de vocês, em ambiente silencioso. Fazer teste de 20 segundos e ouvir. Evitar duas capturas simultâneas do mesmo microfone. Manter picos abaixo da saturação; alvo prático entre −12 e −6 dB.
5. OBS Studio: usar o assistente de configuração para gravação; adicionar captura da janela do navegador, microfone e, se desejado, câmera. Conferir o medidor de áudio e gravar um teste. Fonte oficial: https://obsproject.com/kb/quick-start-guide.
6. Gravar por blocos. Guardar uma tomada contínua do POST → sucesso → GET/recarga, para comprovar o fluxo. Não acelerar essa evidência a ponto de torná-la ilegível. Webcam é opcional para o vídeo Front; participação de todos na defesa presencial é obrigatória.

## 3. Vídeo Front — roteiro de 2min45

Tempo é orçamento de cena, não duração garantida da leitura. Ensaiar com cronômetro, reservar pausas para cliques e ajustar a gravação final para ficar abaixo de três minutos.

### 00:00–00:17 | Vinicius | Home e identificação

Fala: “Nós somos Vinicius, Yan e Diego, da turma 1TDSPV. Este é o EcoLar, uma proposta para ajudar o cidadão a compreender seu consumo de energia, acompanhar metas e comparar hábitos. O MVP usa dados fictícios e não depende de sensores.”

Tela: Home, depois identificação pequena com nomes/RMs. Texto de apoio: “EcoLar • FIAP • CitizenTech”. Corte seco, sem vinheta longa.

### 00:17–00:37 | Vinicius | Páginas e estrutura

Fala: “Construímos uma SPA com React, Vite e TypeScript, usando Tailwind como base visual. Temos Início, Sobre, Integrantes, FAQ e Contato, além das páginas da solução. Os componentes de formulário, título e feedback são reutilizados. O painel usa uma rota parametrizada pelo identificador da residência.”

Tela: navegar pelas cinco páginas; fechar com URL /residencias/ID. Inserir uma captura breve das pastas src. Não gastar tempo rolando todos os textos.

### 00:37–01:18 | Diego | Consulta e escrita reais

Fala, após homologação: “Aqui a listagem vem de uma consulta GET à nossa API Java publicada no Render. Vou registrar um consumo fictício. A requisição usa Fetch e retorna a confirmação do servidor. Agora recarrego o painel: o mesmo registro continua disponível. A persistência acontece no Oracle, acessado pelo Java com DAO e JDBC, e não no armazenamento local do navegador.”

Tela: Network com GET 200; formulário com data livre e 7,5 kWh; POST 201; ID retornado; recarga/GET com o mesmo ID. Mostrar origem SIMULADO. Legendas de apoio: “GET real” / “POST real” / “Recarga confirma consulta”. Se houver falha, corrigir antes da gravação final; não narrar sucesso inexistente.

### 01:18–01:41 | Yan | Validação e estados

Fala: “As entradas são validadas e o usuário recebe mensagens claras. Campo obrigatório vazio não segue para a API. Durante a consulta mostramos carregamento; sem registros, um estado vazio; se a API falha, informamos a indisponibilidade. Dias sem registro não são tratados como zero nem como economia comprovada.”

Tela: erro de campo, depois estado vazio e evidência curta de falha preparada em ambiente de teste. Não desligar a produção durante a gravação. Remover qualquer override de rede ao terminar.

### 01:41–02:04 | Yan | Responsividade

Fala: “Verificamos a interface em 390 por 844, 768 por 1024 e 1440 por 900 pixels. No celular, o menu recolhe e os conteúdos se reorganizam. No tablet e no desktop, aproveitamos a largura mantendo os campos e informações legíveis, sem cortes ou rolagem horizontal indevida.”

Tela: três tamanhos do DevTools, com os números visíveis e dados reais retornados pelo Java. Essa fala depende da homologação com dados; a verificação inicial local não encerra esse item.

### 02:04–02:27 | Vinicius | Solução e limites

Fala: “O painel acompanha consumo e metas com base nos registros disponíveis. O simulador compara potência, tempo de uso, quantidade de aparelhos e tarifa. Ele é um cálculo matemático, não uma previsão de inteligência artificial. As análises de IA dependem dos modelos reais integrados pelo Java.”

Tela: meta com cobertura parcial, simulador com 1000 W, cinco e quatro horas, 30 dias, um aparelho e tarifa de 0,90: diferença estimada de 27 reais. Usar a palavra estimativa.

### 02:27–02:45 | Todos / Vinicius fecha | Publicação e autoria

Fala, após cumprir os itens: “A aplicação está publicada na Vercel e o código está no repositório público do grupo. O README reúne execução, participantes e links. Cada integrante tem pelo menos cinco commits úteis. Usamos IA como apoio, com revisão do grupo. O EcoLar transforma registros em informação para decisões mais conscientes.”

Tela: URL Vercel, README e histórico real de contribuições. Fechar com EcoLar e nomes. Não afirmar a contagem antes de comprová-la. Margem final de até dez segundos; nunca ultrapassar três minutos.

## 4. Vídeo Java — roteiro de 4min30

### 00:00–00:25 | Diego

“O EcoLar organiza residências, consumos diários e metas. Nossa API Spring Boot recebe as operações do front e mantém os dados no Oracle. Uma residência se relaciona com vários consumos e metas. A demonstração usa dados fictícios.”

Mostrar API remota e front público. Não mostrar senhas nem configuração de conexão com valores secretos.

### 00:25–01:10 | Diego

“O código separa model, DAO, DTO, controller, exception, handler e config. Os controllers recebem DTOs de entrada validados com Bean Validation. O ModelMapper apoia a conversão. Os DAOs recebem DataSource por construtor e executam SQL com PreparedStatement. O handler centraliza os erros em JSON. Utilizamos JDBC conforme o enunciado.”

Mostrar os arquivos reais correspondentes. Se o Java entregue diferir, corrigir implementação ou roteiro; não apresentar só um diagrama como prova.

### 01:10–02:45 | Vinicius e Diego

“Pelo front, consultamos as residências e criamos um consumo. Agora conferimos o identificador devolvido, recarregamos e consultamos o mesmo registro no Oracle. Em seguida, alteramos o valor, verificamos a atualização e removemos apenas esse registro de demonstração. A listagem passa a refletir a exclusão.”

Mostrar GET, POST 201 + Location, PUT 200 e DELETE 204 com sequência legível. Evidenciar CRUD das três entidades em testes complementares/coleção e, no vídeo, priorizar o fluxo principal integrado. Se o tempo permitir, cadastro/edição de meta e consulta aninhada também.

### 02:45–03:30 | Yan

“Uma entrada inválida retorna 400 com orientação por campo. Um identificador inexistente retorna 404. A duplicidade de consumo por residência e data é um conflito e retorna 409. A regra permanece no servidor e no banco, mesmo que alguém ignore a validação do navegador.”

Mostrar requisições reais no cliente HTTP e resposta. Não provocar falha 500 artificial em produção apenas para a filmagem.

### 03:30–04:10 | Diego

“A imagem de publicação usa Docker multi-stage. A API está no Render, com as credenciais do Oracle definidas no ambiente do servidor. CORS permite a origem da aplicação Vercel. O navegador usa Fetch; não recebe usuário ou senha do banco.”

Mostrar Dockerfile, configuração CORS sem segredos, URL publicada e uma chamada do front. Para IA, incluir somente se houver integração real, descrevendo Java → Flask e o modelo utilizado.

### 04:10–04:30 | Vinicius

“O README descreve execução e links de demonstração. Cada integrante consegue explicar o fluxo da interface até a persistência. Os testes e limitações estão registrados para que a avaliação seja reproduzível.”

## 5. Pitch de Negócios — roteiro de 4min40

O PDF sugere problema, solução, demonstração, modelo e impacto (p. 93). Usar voz real e mostrar produto funcionando. O dado atualizado abaixo usa a edição 2026 do Anuário EPE, ano-base 2025; é diferente do recorte mensal usado no documento de planejamento do grupo. Não confundir as séries.

### 00:00–00:45 | Yan | Problema e evidência

“Entender a conta de luz não é o mesmo que entender o próprio consumo. O EcoLar nasce para apoiar quem organiza as despesas de uma residência e quer acompanhar hábitos ao longo do mês. Segundo o Anuário Estatístico de Energia Elétrica 2026 da EPE, a classe residencial respondeu por cerca de 179,65 terawatts-hora em 2025, com crescimento de 1,7% sobre 2024. Esse contexto mostra a relevância do tema, mas não permite concluir que esse aumento foi desperdício. A dificuldade de compreensão e a disposição a pagar pela nossa proposta ainda precisam ser validadas com usuários.”

Tela: problema em uma frase e dado com fonte/ano. Fonte: https://dashboard.epe.gov.br/apps/anuario-livro/livro/pt/destaques.html. Página oficial localizada na pesquisa de 15/11/2026; guardar a referência utilizada na versão final do PDF.

### 00:45–01:25 | Vinicius | Solução

“Nossa proposta reúne histórico diário, metas de consumo, custo estimado e comparação de cenários em uma jornada simples. O cidadão informa seus registros, acompanha o período e entende quais dados ainda faltam. Não exigimos sensor ou compra de equipamento. O MVP acadêmico é gratuito, sem login e usa dados fictícios. Uma versão comercial precisaria de autenticação, proteção dos dados e cobrança, que estão fora da entrega atual.”

Tela: Home e jornada de residência até painel.

### 01:25–02:45 | Vinicius e Diego | Demonstração

“Nesta residência demonstrativa, vou registrar o consumo de um dia. O sistema valida os campos, envia a operação para a API e apresenta a confirmação. Ao recarregar, o histórico continua disponível porque o Java persiste no Oracle. Aqui vemos o total registrado e a cobertura do período. Quando faltam dias, o painel informa que o resultado é parcial. A meta ajuda a comparar o histórico com um limite escolhido. No simulador, reduzir o tempo de uso de um aparelho altera o cenário estimado, sem prometer que essa diferença será a economia real da família. As análises de previsão e padrão só serão mostradas como funcionando quando houver resposta dos modelos treinados.”

Tela: fluxo contínuo e legível. Se a integração de IA estiver homologada, substituir a última frase por explicação do resultado real, modelo e limitações, e mostrar sua execução. Se não estiver, apresentá-la como pendência; reconhecer que o requisito correspondente não está concluído.

### 02:45–03:45 | Diego | Modelo e viabilidade

“O modelo escolhido para estudo é B2C: assinatura futura de dez reais e noventa centavos por mês, paga pelo responsável da residência. O diferencial pretendido é o acompanhamento continuado com histórico e metas. Existem alternativas gratuitas, como o simulador da Enel; por isso, o valor adicional precisa ser comprovado. No nosso cenário acadêmico, o desenvolvimento custa dez mil cento e sessenta e quatro reais. Com duzentas assinaturas médias, os custos propostos resultam em cerca de quinhentos e sessenta e dois reais por mês após rateio e provisões. São hipóteses, não receita conquistada.”

Tela: preço, investimento e cenário com rótulo “Hipóteses acadêmicas”. Não mostrar preços como cobrança ativa.

### 03:45–04:40 | Yan e fechamento por todos | Impacto

“Vamos avaliar se as pessoas entendem os indicadores, conseguem concluir a jornada e voltam a registrar seus consumos. Para analisar economia, precisamos comparar períodos equivalentes e considerar clima, tarifa e mudanças de rotina. No cenário ilustrativo de duzentos e cinquenta quilowatts-hora por mês e tarifa de um real, uma redução de cinco por cento equivale a cento e cinquenta reais por ano. Descontada a assinatura anual de cento e trinta reais e oitenta centavos, o benefício líquido seria dezenove reais e vinte centavos. Esse exemplo mostra que o retorno depende do resultado real. O EcoLar busca contribuir para o uso eficiente de energia e a informação para o consumo consciente, relacionados aos ODS 7 e 12. Queremos ajudar o cidadão a transformar seus registros em decisões compreensíveis.”

Tela: ROI explicitamente hipotético; métricas do piloto; ODS como contribuição pretendida. Fecho até 4min40, com margem antes do limite de 5 minutos.

## 6. Edição passo a passo

Recomendação prática: OBS para captura e Shotcut para montagem; o Shotcut é gratuito e tem tutoriais oficiais de texto, voz, cortes e exportação: https://www.shotcut.org/tutorials/. As etapas abaixo são decisões de produção deste projeto, não requisitos impostos pelo professor.

1. Criar projeto 1920×1080, 30 fps, 16:9. Importar as tomadas e ordená-las conforme os intervalos do roteiro.
2. Primeiro montar a demonstração e a fala, depois adicionar textos. Cortar silêncio excessivo e erros, preservando o contexto das operações. Não acelerar para esconder carregamento ou falha.
3. Usar corte seco; uma transição discreta de até 0,2 s apenas ao trocar assunto. Não usar abertura longa, trilha alta ou efeito sobre o JSON/URL.
4. Adicionar nomes/RMs na abertura e rótulos curtos: “Fetch”, “GET 200”, “POST 201”, “390 × 844”, “Estimativa”. Não colocar parágrafos de slide sobre a aplicação.
5. Legendas revisadas manualmente, com no máximo duas linhas. Corrigir termos como kWh, Vercel, JDBC e Oracle. Acompanhar a fala real, não simplesmente colar o roteiro com tempo fixo.
6. Manter voz uniforme e sem saturação. Música é dispensável; se usada, deve ser licenciada e muito baixa. Nenhuma vinheta musical é requisito.
7. Exportar MP4, H.264, 1080p, 30 fps, áudio AAC. Conferir o arquivo exportado inteiro: duração, legibilidade, som, ausência de segredos e correspondência entre fala e ação.
8. Subir no YouTube na conta do grupo/responsável, escolher público ou não listado conforme a disciplina, conferir o processamento e testar o link em janela anônima. Não publicar como privado.
9. Atualizar README/entrega.json e PDF de Negócios com o link adequado. O vídeo não substitui ZIP ou PDF no Portal.

## 7. Títulos e descrições prontos

Título Front: “EcoLar | Global Solution FIAP 2026/2 | Front-end — React, TypeScript e API Java”.

Descrição Front, completar os links reais antes de publicar:

“EcoLar — CitizenTech. Projeto acadêmico para acompanhar registros de energia, metas e cenários de consumo. Equipe 1TDSPV: Vinicius Pacheco Ruiz (RM 571109), Yan Almeida (RM 568814) e Diego Barbosa (RM 568829). Tecnologias: React, Vite, TypeScript, Tailwind e Fetch; integração com API Java/Oracle. GitHub: inserir URL pública real. Aplicação: inserir URL Vercel. API: inserir URL Render. Demonstração com dados fictícios. Cálculos e análises não representam economia garantida. IA utilizada como apoio de desenvolvimento, com revisão do grupo.”

Título Java: “EcoLar | API Java Spring Boot, JDBC e Oracle | GS FIAP 2026/2”. Descrição: mesma equipe, URL da API, repositório Java, Vercel e instruções no README. Título Pitch: “EcoLar | Consumo consciente de energia | Pitch CitizenTech FIAP 2026/2”. Descrição: público, proposta, equipe, link da solução e fonte EPE utilizada; destacar hipóteses comerciais.

## 8. Apresentação presencial e perguntas

O PPTX inclui notas do apresentador e blocos por disciplina. Para Front, usar slides 1–13; para aprofundar Java, 14–16; Negócios, 17–23. A exposição oral precisa incluir aplicação e arquivos reais, não só slides. Ajustar ao tempo indicado pelo professor.

Ensaio de Front (sugestão 8–10 min): Vinicius apresenta problema/solução, navegação e formulário; Yan demonstra três tamanhos, indicadores, dados ausentes e limites; Diego explica Fetch, Java, persistência e erros; os três fecham com contribuições e respondem. Evitar uma pessoa dominar o tempo ou decorar termos que não consegue explicar.

| Pergunta provável | Resposta que vocês precisam compreender |
| --- | --- |
| Por que React + Vite? | Stack exigida; React compõe UI e Vite executa/builda. TypeScript verifica tipos antes de publicar. |
| Por que Tailwind? | Estilização principal exigida; utilitários mobile-first e padrões próprios mantêm consistência. |
| O que torna a rota dinâmica? | O parâmetro identifica a residência; ele é validado e usado na consulta, não é uma página duplicada para cada casa. |
| Por que Zod se temos TypeScript? | Tipo TS não valida JSON externo em tempo de execução; schema confere o dado recebido. |
| Onde está o Fetch? | src/services/http.ts centraliza transporte; ecolar.ts define operações do domínio. |
| Onde estão os dados? | No Oracle pela API; o React mantém estado temporário para renderizar a tela. |
| Como impedir consumo duplicado? | Validação/regra Java e restrição Oracle, devolvendo 409; UI só auxilia. |
| Qual diferença entre vazio, zero e erro? | Vazio é ausência de registros, zero é valor informado e erro é consulta não concluída. |
| O contato envia e-mail? | Só prepara texto; pode abrir o cliente configurado. Nunca anuncia envio sem servidor. |
| O simulador é IA? | Não. Usa potência/1000 × horas × quantidade × dias e tarifa para estimativa. |
| O que falta para virar produto? | Autenticação, isolamento, governança de dados, validação com usuários, cobrança e operação compatível com SLA. |
| A economia é garantida? | Não. O ROI é cenário com premissas explícitas; resultado real precisa ser medido. |
| Como participaram? | Cada pessoa explica commits reais e demonstra a alteração que compreende. |

Em Negócios, abrir Jira/Trello e mostrar épicos, HUs, responsáveis, prioridades, evolução e critérios de aceite. Relacionar HU02 ao formulário, HU03 ao painel e HU04 às metas. Mostrar UC01 e seu fluxo de atividade; discutir exceção de duplicidade. Justificar preço, ROI, SLA e comparação com alternativa gratuita. Não declarar entrevistas, clientes, métricas de IA ou testes que não aconteceram.
