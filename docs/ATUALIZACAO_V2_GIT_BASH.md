# EcoLar v2 — atualização pelo Git Bash do VS Code

Este procedimento continua seu repositório existente e preserva o commit inicial `858226c`. Não executar `git init` novamente, não apagar `.git` e não usar push forçado. O código foi preparado com apoio de IA: revise, execute, entenda e ajuste o trabalho antes de registrar os commits. Não troque o autor para simular a participação dos colegas.

O PDF exige cinco commits por integrante e quinze no total. Ele não obriga fazer tudo na main nem proíbe o commit inicial nela. Usaremos branch e pull request como organização do grupo. Os quatro commits abaixo são grupos de mudanças concretas; somados ao seu commit inicial, resultam em cinco, se você executar/revisar todos e eles forem preservados no histórico.

## 1. Preparar a pasta e conferir a identidade

No VS Code, abra a pasta original `C:\Users\10\Downloads\EcoLar_Frontend\ecolar-frontend`. Em Terminal → Novo Terminal, selecione **Git Bash**. Pare o servidor com Ctrl+C se estiver usando esse mesmo terminal.

```bash
cd /c/Users/10/Downloads/EcoLar_Frontend/ecolar-frontend
pwd
git status --short
git branch --show-current
git log -1 --oneline
```

Antes de copiar arquivos, `git status --short` deve estar vazio. Se aparecer alguma alteração sua, preserve/revise essa alteração primeiro; não sobrescreva um trabalho pendente. Se o histórico já tiver mudanças além da versão inicial, compare os arquivos antes da atualização.

Configure apenas este repositório e confira:

```bash
git config --local user.name "Vinicius Pacheco Ruiz"
git config --local user.email "viniciuspr2006@gmail.com"
git config --get user.name
git config --get user.email
git remote -v
```

`origin` deve apontar para `https://github.com/ecolar-fiap-2026/ecolar-frontend.git`. Se não existir nenhum `origin`, execute apenas nesse caso:

```bash
git remote add origin https://github.com/ecolar-fiap-2026/ecolar-frontend.git
```

Se apontar para outro endereço, confira antes de continuar. A configuração de nome/e-mail identifica commits; não faz login. O push pode abrir a autenticação do GitHub. Use sua conta `viniciuspr27`. Verifique no GitHub que o e-mail configurado está vinculado à sua conta.

## 2. Criar a branch da atualização

Com o diretório de trabalho limpo:

```bash
git switch main
git pull --ff-only origin main
git switch -c feat/experiencia-ecolar-v2
git branch --show-current
```

O último comando deve mostrar `feat/experiencia-ecolar-v2`. Se a branch já existir por você ter começado este roteiro, use `git switch feat/experiencia-ecolar-v2`; não recrie nem apague o histórico.

## 3. Extrair e aplicar a atualização

Baixe **EcoLar_Atualizacao_v2.zip** e use “Extrair tudo”. A pasta extraída deve conter `arquivos` e este guia. O caminho usado abaixo supõe:

`C:\Users\10\Downloads\EcoLar_Atualizacao_v2\arquivos`

A pasta `arquivos` contém somente os arquivos novos/alterados, em seus caminhos corretos. O ZIP não contém `.git`, `.env.local`, `node_modules` ou credenciais. O ZIP completo é uma cópia de referência; para o seu repositório já existente, use esta atualização.

Faça uma cópia dos diretórios que serão alterados, fora do projeto:

```bash
mkdir -p ../backup-antes-ecolar-v2
cp -R src public tests docs ../backup-antes-ecolar-v2/
cp README.md ../backup-antes-ecolar-v2/
```

Confira o caminho extraído; depois copie seu conteúdo para a pasta atual:

```bash
ls /c/Users/10/Downloads/EcoLar_Atualizacao_v2/arquivos
cp -R /c/Users/10/Downloads/EcoLar_Atualizacao_v2/arquivos/. .
git status --short
git diff --stat
```

Se o Windows criar uma pasta extra na extração, ajuste o caminho até a pasta que contém `src`, `public`, `tests`, `docs` e `README.md`. Não copie uma pasta inteira chamada `ecolar-frontend` para dentro de outra de mesmo nome.

Esta atualização não sobrescreve `entrega.json`, integrantes, contatos, `.env.local`, `package.json` ou lockfile. O README atualizado inclui o repositório conhecido; confira se você tinha acrescentado outra informação antes de substituí-lo.

## 4. Executar e revisar

```bash
npm ci
npm run check
npm run build
npm run dev
```

No Git Bash, use `npm`. Se você acidentalmente estiver no PowerShell com bloqueio do `npm.ps1`, use `npm.cmd` ou volte ao Git Bash; não é necessário mudar a política de execução do computador.

Abra a URL que o Vite mostrar, normalmente `http://localhost:5173/`. Confira início, menu mobile, Como funciona, simulador, calculadora de leituras e formulário de residências. Sem URL Java, o cadastro mostra indisponibilidade e não confirma gravações.

O resultado automatizado esperado desta versão é **46 testes aprovados**. Isso não comprova Oracle ou API remota. No DevTools, testar 390×844, 768×1024 e 1440×900, zoom 100%. Repetir com dados reais da API assim que ela estiver conectada.

## 5. Registrar os quatro grupos de mudanças

Use outro terminal Git Bash enquanto o Vite estiver rodando, ou encerre o servidor com Ctrl+C. Antes de cada commit, leia os arquivos e o `git diff --cached`. Pressione `q` para sair do visualizador. Não executar `git add .`, pois isso juntaria todos os grupos e poderia incluir alterações suas que não pertencem a esta revisão.

### Commit 2 — interface e navegação

Revise a Home com a ilustração, cores, menu lateral, atalhos no celular e a página Como funciona. Confirme que sabe explicar o uso de componentes e rotas.

```bash
git add src/App.tsx src/index.css src/components/Layout.tsx src/pages/Home.tsx src/pages/HowItWorks.tsx public/images/casa-ecolar.webp
git diff --cached --stat
git diff --cached
git commit -m "feat: renovar interface e navegacao responsiva do EcoLar"
```

### Commit 3 — calculadora de leituras

No simulador, abra a calculadora. Confira duas leituras consecutivas, por exemplo 1000 e 1007,5 kWh. O resultado é 7,5 kWh. Confira também um intervalo com vários dias, um valor menor que a leitura anterior e consumo zero. Só um intervalo diário pode preencher o formulário de registro.

```bash
git add src/components/MeterCalculator.tsx src/utils/readings.ts src/pages/ConsumptionEditor.tsx src/pages/Simulator.tsx tests/readings.test.ts
git diff --cached --stat
git diff --cached
git commit -m "feat: calcular consumo entre leituras com validacao de periodo"
```

### Commit 4 — acompanhamento e histórico

Revise os atalhos de período, avisos de cobertura, metas, orientação do cadastro e exportação CSV. Os testes isolados comprovam cálculo/exportação; a prova do painel com dados persistidos fica para quando o Java estiver pronto.

```bash
git add src/pages/Dashboard.tsx src/pages/Residences.tsx src/utils/history.ts tests/history.test.ts
git diff --cached --stat
git diff --cached
git commit -m "feat: melhorar acompanhamento e exportar historico de consumo"
```

### Commit 5 — integração e documentação

Leia o guia Oracle/Java com Diego e Yan. Confira o README, os créditos da ilustração e as evidências de validação. Não preencha evidências de integração que vocês ainda não executaram.

```bash
git add README.md docs/ATUALIZACAO_V2_GIT_BASH.md docs/ORACLE_JAVA_PASSO_A_PASSO.md docs/VALIDACAO_V2.md docs/VALIDACAO.md docs/RECURSOS_VISUAIS.md
git diff --cached --stat
git diff --cached
git commit -m "docs: orientar integracao Java Oracle e revisao da interface"
```

Cada commit tem uma finalidade e arquivos próprios. Não criar commits vazios, datas inventadas ou mudanças artificiais apenas para contar pontos. A revisão humana precisa acontecer antes do registro.

## 6. Conferir e enviar a branch

```bash
git status --short
git log -5 --oneline
git log -5 --format="%h | %an <%ae> | %s"
git push -u origin feat/experiencia-ecolar-v2
```

O status deve ficar limpo, salvo alterações suas que não façam parte destes grupos. Se o push falhar, resolver a mensagem específica; não usar `--force`.

No GitHub, abrir o repositório, usar Compare & pull request e conferir:

- Base: `main`.
- Compare: `feat/experiencia-ecolar-v2`.
- Título: `Melhora a experiência do EcoLar e orienta a integração Java/Oracle`.
- Descrição: `Atualiza a interface responsiva, adiciona orientações ao morador e calculadora de leituras, melhora o histórico e documenta a integração. TypeScript, 46 testes e build verificados. Java/Oracle, deploy e validação remota permanecem pendentes.`

Pedir revisão do grupo. Depois de conferir o diff e os testes, usar **Create a merge commit / Merge pull request** para preservar os commits individuais. `Squash and merge` combina os commits e dificulta evidenciar a contagem pedida. O método de merge é recomendação nossa, não exigência literal do PDF.

Depois do merge:

```bash
git switch main
git pull --ff-only origin main
git log --oneline --graph -12
git shortlog -sne --no-merges HEAD
```

A contagem ajuda a auditar participação; o professor avalia também o conteúdo e o domínio do código. Não apagar a branch antes de confirmar a integração. Não é obrigatório apagá-la.

## 7. Mensagem para encaminhar ao grupo

> Pessoal, vamos trabalhar no repositório público ecolar-fiap-2026/ecolar-frontend. Cada um precisa contribuir de verdade e ter pelo menos cinco commits próprios; o grupo precisa de pelo menos quinze. O front v2 está organizado em uma branch para revisão. Cada um usa sua conta e seu e-mail no Git. Não vamos fazer commits vazios nem mudar autoria. Usem branches por tarefa, abram PR e preservem os commits no merge. Não adicionem node_modules, senhas ou arquivos .env. A API Java e a persistência Oracle ainda precisam ser comprovadas antes da entrega.

Sugestões de cinco tarefas úteis para cada colega, a executar quando houver informações reais:

| Integrante | Contribuições no repositório do front |
| --- | --- |
| Yan | 1. Registrar o mapeamento real das entidades/colunas sem credenciais. 2. Conferir identificação/fotos/links autorizados dos integrantes. 3. Revisar conteúdo do FAQ com dúvidas do consumidor. 4. Executar e documentar casos de dados ausentes/zero/duplicidade com Oracle. 5. Corrigir problemas encontrados na revisão de responsividade e acessibilidade. |
| Diego | 1. Ajustar contrato de endpoints aos controllers implementados. 2. Adaptar serviços/tipos do front aos DTOs reais. 3. Tratar erros reais 400/404/409 e documentar a integração. 4. Validar GET/escrita/recarga com Oracle e registrar evidências. 5. Configurar o ambiente publicado, testar rotas e atualizar os links finais do README. |

Essas tarefas não são commits já feitos. Se uma tarefa não exigir mudança após a revisão, escolher outra contribuição necessária. Aulas de outras disciplinas/commits em outro repositório não substituem automaticamente os commits pedidos neste front.

## 8. Antes da entrega acadêmica

Esta atualização é para desenvolvimento, não o ZIP final validado para o Portal. Manter a rubrica original em `docs/RUBRICA.md`: API Java remota, GET + escrita real, publicação Vercel, vídeo Front até 3 minutos, README/identificação/links, mínimo de commits e domínio do código. ZIP final até 50 MB e sem `node_modules`. `npm run check:delivery` continuará apontando pendências até vocês completarem as evidências.

Referência sobre merge: https://docs.github.com/en/pull-requests/reference/pull-request-merges (consulta em 15/11/2026).
