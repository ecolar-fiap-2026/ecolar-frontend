# EcoLar · Front-End Design Engineering

Global Solution FIAP 2026/2 · CitizenTech · Turma 1TDSPV.

O EcoLar ajuda o responsável pelo orçamento doméstico a organizar consumos diários de energia, acompanhar metas e comparar cenários de aparelhos. Esta versão acadêmica usa somente dados fictícios e não possui autenticação.

## Situação desta versão

Código do front implementado e compilável. A API Java do grupo não foi fornecida nesta preparação. Os serviços seguem um **contrato proposto**, baseado no guia EcoLar anexado. A conexão real, o Oracle, os deploys e os vídeos ainda precisam ser validados pelo grupo. Não há mock de produção, base falsa de residências nem sucesso simulado de gravação.

Sem `VITE_API_BASE_URL`, páginas institucionais e simulador funcionam; páginas dependentes do servidor mostram indisponibilidade. Não entregar essa condição como integração concluída.

## Integrantes

| Nome | RM | Turma | Responsabilidade principal |
| --- | --- | --- | --- |
| Vinicius Pacheco Ruiz | 571109 | 1TDSPV | Front-end e Python |
| Yan Almeida | 568814 | 1TDSPV | Banco e IA |
| Diego Barbosa | 568829 | 1TDSPV | Java e Modelo de Negócio |

Identificação transcrita da documentação Python anexada. Conferir com o cadastro oficial antes do envio. Todos devem revisar, contribuir e explicar o front.

## Tecnologias

React, Vite, TypeScript, Tailwind CSS, React Router, Fetch API, Zod para validação de contratos, Lucide para ícones e Vitest para testes. Versões exatas em `package.json` e `package-lock.json`. Sem Axios, Next.js, Create React App ou template de aplicação pronto. A configuração foi escrita para este projeto. Ícones Lucide são recursos de biblioteca, não um tema pronto.

## Executar no VS Code

Recomendado: Node.js 24 LTS e npm. O projeto declara Node >=22.12. Foi testado com Node 24.22.1 / Linux.

1. Extraia a pasta inteira e abra `ecolar-frontend` no VS Code.
2. Abra Terminal > Novo Terminal. Confirme que `package.json` está nessa pasta.
3. Execute:

```bash
npm install
```

4. Copie `.env.example` para `.env.local`. No PowerShell:

```powershell
Copy-Item .env.example .env.local
```

5. Defina `VITE_API_BASE_URL` com a URL real da API Java, incluindo `/api` apenas se esse prefixo existir no Java. Exemplo exclusivamente local: `http://localhost:8080`.
6. Execute:

```bash
npm run dev
```

Abra a URL mostrada pelo Vite. Reinicie o servidor depois de alterar `.env.local`.

```bash
npm run check
npm run build
npm run preview
```

`check` verifica TypeScript e os testes. `build` gera `dist`. `preview` confere o build local. Na Vercel, o diretório de saída é `dist` e o comando é `npm run build`.

## Configuração pública

| Variável | Uso |
| --- | --- |
| VITE_API_BASE_URL | Base da API Java real. Obrigatória para dados remotos. |
| VITE_CONTACT_EMAIL | E-mail real do grupo, opcional. Habilita abertura do aplicativo de e-mail. |

Variáveis `VITE_` ficam visíveis no navegador. Não colocar senhas, tokens secretos ou credenciais Oracle. O contato apenas prepara texto e, quando configurado, abre `mailto:`. Não afirma envio automático.

## Rotas

| Rota | Finalidade |
| --- | --- |
| `/` | Home |
| `/integrantes` | Identificação e responsabilidades |
| `/sobre` | Proposta, funcionamento e limites |
| `/faq` | Dúvidas frequentes |
| `/contato` | Formulário com validação e preparo de mensagem |
| `/residencias` | Consulta, cadastro, edição e exclusão de residência |
| `/residencias/:id` | Painel, histórico, cobertura, metas e solicitações de IA |
| `/residencias/:id/consumos/novo` | Cadastro de consumo |
| `/residencias/:id/consumos/:consumoId/editar` | Edição do consumo |
| `/residencias/:id/metas` | Cadastro, edição e exclusão de metas |
| `/simulador` | Comparação matemática de cenários |
| `*` | Página não encontrada |

## Estrutura

| Pasta / arquivo | Responsabilidade |
| --- | --- |
| src/components | Layout, campos, mensagens, indicadores, gráfico e análises |
| src/pages | Páginas e composição das jornadas |
| src/services | Fetch, erros HTTP e funções por operação |
| src/types | Contratos e tipos de residência, consumo, meta e IA |
| src/hooks | Carregamento remoto com cancelamento e nova tentativa |
| src/utils | Cálculos, datas, moeda e validação |
| src/data | Conteúdo de FAQ e integrantes |
| public | Favicon; imagens adicionais podem ser adicionadas aqui |
| tests | Casos isolados de cálculo, validação e contrato HTTP |
| docs | Guia de integração, participação, vídeos, rubrica e evidências |
| vercel.json | Reescrita das rotas SPA para index.html |

`Field`, `PageIntro`, `Notice`, `Empty` e outros componentes são reutilizados em diversas páginas. Tailwind é a estilização principal, com utilitários responsivos e classes de componentes em `src/index.css`.

## Integração e persistência

O navegador chama Java por Fetch e HTTP/JSON. Java acessa Oracle por DAO/JDBC. Veja [CONTRATO_API.md](docs/CONTRATO_API.md) e [openapi.proposto.json](docs/openapi.proposto.json). São propostas a confrontar com os controllers e DTOs reais de Diego. Não renomear campos do banco para atender ao front sem alinhar o grupo; adapte DTOs/serviços quando necessário.

Residências, consumos e metas dependem da API. O front não grava esses recursos em localStorage. Cálculos do painel usam apenas os registros retornados. Datas sem registro não são zero; custo é estimado pela tarifa atual. Análises de IA só aparecem após uma resposta real e válida. O simulador é matemático, independente de Python e sem IA.

## URLs finais e contato

Preencher antes do Portal, também em `entrega.json`:

| Recurso | Endereço |
| --- | --- |
| GitHub público | PENDENTE: criar repositório do grupo |
| Vercel pública | PENDENTE: publicar e testar |
| API Java no Render | PENDENTE: Diego informar URL real |
| YouTube Front, até 3 min | PENDENTE: gravar e publicar |
| Contato do grupo | PENDENTE: informar e-mail oficial |

## Validação e entrega

Leia [VALIDACAO.md](docs/VALIDACAO.md). Os testes HTTP isolados substituem Fetch somente durante testes automatizados; não são prova de Java/Oracle funcionando. A verificação remota deve incluir GET, POST, recarga, persistência Oracle, CORS e erros 400/404/409.

Resoluções exigidas: 390 × 844, 768 × 1024 e 1440 × 900 px. Acesso direto a rota interna precisa funcionar após recarregar na Vercel.

Repositório público, 5 commits reais por integrante e ao menos 15 no total. O plano em [GITHUB_E_COMMITS.md](docs/GITHUB_E_COMMITS.md) não cria nem comprova commits. Cada integrante usa sua própria conta e contribui de fato.

Execute `npm run check:delivery` para identificar dados finais ausentes. Ele começa bloqueado de propósito enquanto houver pendências. Depois de conferir as evidências, gere o ZIP com `powershell -ExecutionPolicy Bypass -File scripts/empacotar.ps1` ou compacte manualmente a lista indicada no guia. O parâmetro do PowerShell vale somente para esse processo e permite executar o script local fornecido.

Entrega Front: um ZIP até 50 MB, sem node_modules, com código, configurações, recursos, README e integrantes.txt. Apenas o representante envia no Portal até **19/11/2026, 23h55**, horário de Brasília. Apresentações: 23 a 27/11, conforme o professor. Não enviar só links.

## Uso de IA e autoria

ChatGPT/Codex apoiou a leitura dos anexos, geração original deste código, testes e materiais. O grupo ainda precisa executar, compreender, revisar e registrar suas contribuições. O enunciado permite apoio de IA e proíbe entregar código gerado sem revisão e domínio (p. 17). Veja [USO_DE_IA.md](docs/USO_DE_IA.md).

## Referências

FIAP, enunciado GS 2026/2: pp. 47-56, 58-74 e regras gerais pp. 12-17. Documentos EcoLar anexados: guia, modelo de negócio, texto de apresentação e documentação Python. Configuração técnica: [Vite](https://vite.dev/guide/), [Tailwind com Vite](https://tailwindcss.com/docs/installation/using-vite), [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite). Consulta em 15/11/2026.
