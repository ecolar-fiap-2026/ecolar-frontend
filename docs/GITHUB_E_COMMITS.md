# GitHub, organização e participação do grupo

Este é um passo a passo para vocês executarem nas próprias contas. Nenhuma organização, convite, repositório ou commit foi criado nesta preparação.

## 1. Criar a organização

1. Entre na sua conta pessoal do GitHub.
2. Foto do perfil > Settings > Organizations > New organization.
3. Escolha GitHub Free. Nome sugerido, sujeito a disponibilidade: `ecolar-fiap-2026`. Não é nome já reservado.
4. Preencha o contato real e conclua as etapas da conta conforme a interface. A organização é do grupo, não precisa representar uma empresa registrada.
5. Dentro da organização, abra People > Invite member. Pesquise os usernames exatos de Yan e Diego, confira os perfis e envie os convites.
6. Mantenha você como Owner e os colegas como Member. Eles precisam aceitar os convites nas próprias contas.
7. Crie um time `equipe-ecolar`, inclua os membros e dê permissão Write no repositório. Ser Member da organização, sozinho, não garante escrita no repositório.

Não compartilhar conta, senha ou token. Cada integrante mantém autoria própria. Se já existe uma organização, use-a após conferir acesso; não crie outra sem necessidade.

## 2. Criar o repositório público

Recomendação para facilitar esta entrega: repositório público `ecolar-frontend` dentro da organização. Nome da pasta local e do repositório podem coincidir. Criar vazio, sem README automático, pois o pacote já tem README e .gitignore. Isso evita duas histórias iniciais independentes.

O guia anterior sugeriu monorepositório com frontend/java/banco/python/ia. Também atende. Se o grupo já usa essa estrutura, preserve-a e coloque este projeto em `frontend/`. Na Vercel, Root Directory = `frontend`. Para repositório exclusivo de front, Root Directory = `.`. Os commits exigidos devem evidenciar participação na frente de Front, não somente SQL ou Java em outra pasta.

## 3. Abrir no VS Code e fazer o primeiro envio

Extraia o ZIP e abra a pasta que contém package.json. Execute `npm install`, `npm run check` e `npm run build`. Leia o README e configure a API quando disponível.

Configure sua identidade local usando seu nome e um e-mail vinculado/verificado no GitHub (ou o noreply exibido na sua conta). Substitua o texto de exemplo:

```bash
git init -b main
git config user.name "SEU NOME COMPLETO"
git config user.email "SEU EMAIL VERIFICADO NO GITHUB"
git status
git add .
git diff --cached --stat
git commit -m "chore: adicionar base EcoLar revisada com apoio de IA"
git remote add origin https://github.com/SUA-ORGANIZACAO/ecolar-frontend.git
git push -u origin main
```

Use a URL HTTPS copiada do botão Code do repositório real. Não digite `SUA-ORGANIZACAO` literalmente. Esse comando inicial só se aplica a pasta nova sem Git; não reinicialize um repositório existente. Se já houver remote, confira com `git remote -v` em vez de adicionar outro. O primeiro commit só deve ocorrer após a leitura e execução por quem assina.

Ao autenticar no VS Code/Git Credential Manager, use o fluxo oficial no navegador. Não colocar token em URL de remote, arquivos ou conversa. Em máquina compartilhada, não deixar credenciais expostas.

## 4. Colegas clonam, criam branch e contribuem

```bash
git clone https://github.com/SUA-ORGANIZACAO/ecolar-frontend.git
cd ecolar-frontend
git config user.name "SEU NOME COMPLETO"
git config user.email "SEU EMAIL VERIFICADO NO GITHUB"
npm install
git switch -c feat/yan-faq-acessibilidade
```

Cada integrante escolhe sua própria branch. Ex.: `feat/vinicius-integracao`, `feat/yan-dados-ux`, `feat/diego-contrato-java`. Antes de começar outra tarefa, atualize `main` com `git switch main` e `git pull --ff-only`, depois crie a nova branch. Não usar force push para resolver divergência.

Para cada alteração real:

```bash
git status
git diff
git add CAMINHOS_DOS_ARQUIVOS_ALTERADOS
git commit -m "mensagem que descreve a alteração real"
git push -u origin NOME_DA_SUA_BRANCH
```

Abra Pull Request no GitHub, descreva o comportamento alterado e a evidência de teste. Outro integrante revisa. Na integração, use **Create a merge commit** para preservar os commits individuais. Evite Squash and merge enquanto a avaliação depender de contar cinco commits por integrante na história final. Não apagar/recriar a história para simular participação.

## 5. Plano de cinco contribuições por pessoa

A base já contém funcionalidades. As tarefas abaixo são **revisões, adaptações e validações reais a realizar**. Não são commits concluídos. Se uma tarefa já estiver integralmente resolvida e não gerar mudança útil, escolham outra necessidade real. Um commit vazio ou uma troca de espaço não demonstra colaboração.

### Vinicius

| Ordem | Trabalho a executar e compreender | Evidência / mensagem sugerida |
| --- | --- | --- |
| 1 | Revisar e importar a base, confirmar instalação no Windows e corrigir ajustes encontrados | `chore: configurar base EcoLar e execução no Windows` |
| 2 | Conectar o contrato final de residências e ajustar serviços/tipos conforme Java | `feat: integrar residências ao contrato Java validado` |
| 3 | Homologar cadastro/edição de consumo e corrigir mensagens ou fluxo conforme teste real | `fix: ajustar registro de consumo após homologação` |
| 4 | Testar painel com dados reais do Java nos três tamanhos e corrigir problemas observados | `fix: refinar painel responsivo com dados da API` |
| 5 | Consolidar README com URLs reais, vídeo, execução e evidências finais | `docs: concluir documentação e evidências de Front` |

### Yan

| Ordem | Trabalho a executar e compreender | Evidência / mensagem sugerida |
| --- | --- | --- |
| 1 | Revisar FAQ segundo regras finais do banco e dados diários, ajustar explicações | `docs: alinhar FAQ ao consumo diário do EcoLar` |
| 2 | Conferir unidades, escala decimal, datas e origens; ajustar schemas e casos de borda | `test: validar contratos de energia e cobertura` |
| 3 | Integrar o formato final das duas análises recebido de Java/Flask | `feat: alinhar respostas de previsão e agrupamento` |
| 4 | Revisar acessibilidade e leitura do gráfico/histórico, corrigir rótulos e resultados parciais | `fix: melhorar leitura acessível dos indicadores` |
| 5 | Documentar testes reais de dados insuficientes e falha da IA, com IDs fictícios e resultados | `docs: registrar homologação das análises e limites` |

### Diego

| Ordem | Trabalho a executar e compreender | Evidência / mensagem sugerida |
| --- | --- | --- |
| 1 | Substituir contrato proposto pelo contrato confirmado de controllers/DTOs | `docs: confirmar endpoints e DTOs da API Java` |
| 2 | Ajustar tratamento de 400/404/409 ao handler real e acrescentar casos de teste pertinentes | `fix: alinhar mensagens ao handler Java` |
| 3 | Conferir Sobre e Contato com o escopo final, definir contato real e revisar textos | `feat: concluir informações institucionais e contato` |
| 4 | Homologar metas e conflitos de período, corrigir o comportamento do front | `fix: alinhar metas às regras do backend` |
| 5 | Ajustar documentação de CORS, Vercel e comprovação de persistência com dados fictícios | `docs: registrar integração remota e persistência Oracle` |

Pessoas podem colaborar, mas cada uma deve assinar apenas sua contribuição real. Não usar `--author` para atribuir trabalho a colegas. O apoio de IA é declarado e não dispensa entender a alteração. Reuniões e revisão sem modificação podem ser registradas no Jira, mas não inventam commits.

## 6. Conferir a contagem final

Na branch principal atualizada:

```bash
git switch main
git pull --ff-only
git shortlog -sne --no-merges HEAD
git log --format="%h | %an | %ae | %s" --no-merges
```

Para monorepo, acrescente `-- frontend` ao final para conferir a frente. Verificar que o e-mail aparece na conta correta. Mínimo: 5 de cada integrante e 15 no total para o trio. Recomendo manter margem de 6 por pessoa quando houver trabalho real, sem gerar alterações artificiais. Não contar o merge automático como substituto da contribuição de código/documentação.

## Mensagem pronta para encaminhar

Pessoal, vamos usar a organização do EcoLar no GitHub e um repositório público para o Front. Cada um entra com a própria conta, aceita o convite e clona o projeto. Precisamos de pelo menos 5 commits úteis por pessoa e 15 no total, preservados na main. A base foi preparada com apoio de IA e todos precisam revisar, executar e compreender a parte que alterarem. Vinicius cuida da integração visual e do painel; Yan revisa dados, indicadores, FAQ e análises; Diego confirma o contrato Java, mensagens, metas e publicação. Vamos trabalhar em branches, abrir PRs e integrar com Create a merge commit, sem squash. Cada tarefa só vai para Concluído com alteração e evidência. Antes do vídeo, precisamos demonstrar um GET e uma gravação reais da Vercel até Java/Oracle, além das três resoluções.

## Referências oficiais consultadas em 15/11/2026

- https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/creating-a-new-organization-from-scratch
- https://docs.github.com/en/organizations/managing-membership-in-your-organization/inviting-users-to-join-your-organization
- https://vercel.com/docs/git/vercel-for-github

Os rótulos da interface podem variar. A organização não é requisito da rubrica; o repositório público e a colaboração são. O Jira/Trello de Negócios continua obrigatório e não é substituído por GitHub Projects.
