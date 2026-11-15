# Publicação e entrega

## Ordem para evitar retrabalho

1. Confirmar a API Java de Diego no Render, ligada ao Oracle, com CRUD funcional.
2. Confirmar o contrato e executar o front local com a URL remota.
3. Subir código revisado no GitHub público.
4. Publicar na Vercel e ajustar CORS para a origem final.
5. Homologar, gravar o vídeo e completar links.
6. Conferir commits, gerar ZIP, extrair e rodar novamente.
7. Representante anexa no Portal de Front até 19/11/2026, 23h55, horário de Brasília.

O prazo de cadastro do grupo era 13/11. Como a preparação é de 15/11, verificar agora se o grupo já aparece no Portal. Se não aparecer, resolver com a FIAP; não assumir prorrogação.

## Configuração da Vercel

Entre com a conta vinculada ao seu GitHub. Add New / New Project, selecione o repositório. Na organização, você precisa de permissão de Owner ou Member com acesso ao repositório. Se ele não aparecer, confira a instalação/permissão do aplicativo Vercel para esse repositório.

| Campo | Valor |
| --- | --- |
| Framework | Vite |
| Root Directory | `.` neste repositório; `frontend` se estiver em monorepo |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js | 24.x, se disponível; respeitar engines/dependências do projeto |
| VITE_API_BASE_URL | URL HTTPS real do Java, com prefixo apenas quando existir |
| VITE_CONTACT_EMAIL | E-mail real do grupo, se definido |

Inclua as variáveis em Production e no Preview se quiser testar previews. Alterar variável do Vite exige novo build/deploy. O `vercel.json` já reescreve rotas SPA para `/index.html`. Não ativar `cleanUrls` sem revisar a configuração.

## Organização e plano da Vercel

Não presumir que GitHub Free e Vercel Hobby têm as mesmas permissões. A documentação de Git da Vercel distingue repositórios privados de organizações, que exigem outro plano; a página de limites também descreve restrições à conexão de repositórios de organizações. Conferir o comportamento real da conta ao importar, antes de depender desse caminho. Não é necessário contratar um plano só para continuar a preparação.

Se a importação da organização for bloqueada, preserve o repositório público canônico e publique a pasta local com a CLI oficial, pela conta de Vinicius. Isso atende à combinação GitHub público + Vercel pública, mas o deploy deixa de ser automático a cada push nesse fluxo:

```bash
npx vercel login
npx vercel
```

Escolha o escopo correto e um projeto novo, informe a pasta atual e confirme o preset Vite. Não selecionar uma conta paga sem querer. Configure as variáveis no painel e publique produção:

```bash
npx vercel --prod
```

Confira no painel se o projeto está configurado para o ambiente correto. Se a CLI oferecer conectar o repositório e isso causar a restrição, use projeto sem integração Git automática. Outra opção é um fork público na conta pessoal com o histórico preservado, documentando o repositório canônico. Não duplicar a história com commits falsos. Não comprar Pro sem decidir isso com o grupo.

Fontes: https://vercel.com/docs/git ; https://vercel.com/docs/limits ; https://vercel.com/docs/cli/deploy ; https://vercel.com/docs/frameworks/frontend/vite . Consulta: 15/11/2026. As regras do plano devem ser conferidas na própria conta.

## Teste obrigatório após publicar

Abrir em janela anônima: Home; Integrantes; Sobre; FAQ; Contato; Residências. Abrir uma URL interna completa do painel e pressionar F5. Cadastrar uma residência fictícia, registrar consumo SIMULADO e recarregar. O ID deve continuar existindo no GET e no Oracle.

No DevTools > Network, filtrar Fetch/XHR, conferir domínio Render, método, status, payload e resposta. Um GET ou POST para Vite, localStorage ou API genérica não comprova a exigência. Não filmar senhas/env do banco. Testar 400, 404 e 409 pelo Java e mostrar mensagens do front. Confirmar que os links não exigem sessão Vercel nem YouTube privado.

Resoluções: 390×844, 768×1024 e 1440×900. Repetir com residência, consumos e metas preenchidos, textos longos, erro e vazio. Teclado: Tab, Shift+Tab, Enter e Escape no diálogo. Conferir menu, foco, labels e scroll. Guardar evidências datadas.

## O que entra no ZIP

Incluir src, public, docs, tests, scripts, index.html, package.json, package-lock.json, tsconfig.json, vite.config.ts, vercel.json, .env.example, .gitignore, README.md, integrantes.txt e entrega.json. `src/assets` pode guardar futuros recursos, mas não precisa existir vazia no ZIP.

Excluir node_modules, .git, dist, .vercel, .env.local, senhas, logs, caches, vídeos e gravações pesadas. Os vídeos ficam no YouTube. Slides e guia geral são materiais de apoio e não precisam inflar o ZIP de código.

Preencher `entrega.json` apenas com evidências verdadeiras e atualizar o README. `npm run check:delivery` não substitui conferir links, histórico Git ou Oracle. O script `scripts/empacotar.ps1` para se houver pendências, falha de testes/build ou arquivo maior que 50.000.000 bytes. Esse limite conservador evita confusão de MB/MiB.

## Depois do envio

Reabrir a entrega no Portal, conferir nome do anexo e comprovante. Não remover Vercel, Render, GitHub ou vídeos durante a correção. Levar cópia offline do código e dos slides para a apresentação, mas demonstrar a API publicada quando a rubrica pedir. Nenhum envio no Portal foi feito por esta preparação.
