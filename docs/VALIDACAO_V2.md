# Validação da atualização v2

Data: 15/11/2026. Estado: front compilável; integração Java/Oracle e publicação final pendentes.

## Verificações locais

- TypeScript e Vitest: 46 testes aprovados em quatro arquivos.
- Build Vite concluído; rotas adicionais carregadas sob demanda. Os três grupos de alteração de código do roteiro também foram reconstruídos cumulativamente sobre a base original e compilaram separadamente.
- Respostas HTTP continuam validadas com Zod e transportadas apenas por Fetch.
- Testes novos: diferença de leituras, intervalo diário versus vários dias, zero medido, valores inválidos, data impossível/invertida, mudança de mês/ano, ano bissexto e conteúdo/ordem do CSV.
- Código formatado com Prettier; nenhuma nova dependência adicionada.

## Revisão no navegador

Foram medidas as 13 rotas abaixo nas três dimensões exigidas: 390×844, 768×1024 e 1440×900. Total: 39 combinações. Nenhuma apresentou largura de documento maior que a área disponível. O navegador de desktop reserva espaço para a barra de rolagem; por exemplo, um frame externo de 390 px pode ter 375 px de área útil.

`/`, `/sobre`, `/faq`, `/integrantes`, `/contato`, `/como-funciona`, `/simulador`, `/residencias`, `/residencias/1`, `/residencias/1/consumos/novo`, `/residencias/1/consumos/1/editar`, `/residencias/1/metas` e uma rota inexistente.

Cenários observados na UI: menu mobile; validação de consumo vazio; cálculo de 1007,5 − 1000 = 7,5 kWh para um dia; preenchimento do formulário pela calculadora; envio a um servidor temporário de teste e atualização de cobertura de 14/15 para 15/15 dias; filtro dos últimos sete dias; cancelamento de exclusão mantendo o registro; simulador com diferença estimada de R$ 27,00; aviso de indisponibilidade após retirar a configuração de teste.

A formatação do CSV foi validada automaticamente. A ferramenta de navegador não confirmou o evento de download durante a revisão em iframe; repetir o download em um navegador comum, com a API real, antes de marcar essa verificação manual como concluída.

As telas preenchidas foram exercitadas com um servidor temporário de teste em memória, isolado desta entrega. Ele não é a API Java, não usa Oracle e não integra o pacote. A captura `EcoLar_Painel_Teste_v2.jpg`, quando compartilhada, mostra esses dados de teste. A aplicação entregue continua sem base de registros fictícia embutida ou fallback de gravação local.

## Limites desta validação

Não foram comprovados: GET/POST remotos em Java, persistência Oracle, CORS do Render, contrato efetivo dos controllers, IA remota, deploy Vercel, vídeo YouTube, commits do grupo ou defesa presencial. Uma interface funcionando com respostas de teste não comprova esses requisitos.

Repetir a navegação completa com a API real, sobretudo criar/editar/excluir, limites de erro, recarga e verificação dos registros no Oracle. Testar as três resoluções novamente no domínio publicado. Preencher `entrega.json` somente com evidências efetivamente obtidas.

## Recursos e estrutura preservados

React + Vite + TypeScript, SPA, Tailwind como estilo principal, Fetch, páginas institucionais, páginas da solução, rotas parametrizadas, componentes reutilizados, validação de formulários e estados de carregamento/erro/vazio. Sem Axios, Next.js, Create React App, template de aplicação pronto ou conexão Oracle pelo navegador.

O PDF não impõe uma branch chamada `develop` nem proíbe `main`. Branch por tarefa e revisão por pull request são recomendações de colaboração. A exigência é repositório público, mínimo de cinco commits por integrante e quinze no total, além dos demais itens da rubrica.

## Conferência pelo grupo

- [ ] Vinícius revisou e compreendeu os arquivos alterados.
- [ ] Yan e Diego revisaram a interface e as orientações.
- [ ] O grupo executou o roteiro real em `ORACLE_JAVA_PASSO_A_PASSO.md`.
- [ ] A exportação CSV foi aberta e conferida no navegador comum.
- [ ] Contratos, URLs finais, identificação e contribuições foram conferidos.
- [ ] A entrega final passou por `check:delivery` e pela rubrica do PDF.
