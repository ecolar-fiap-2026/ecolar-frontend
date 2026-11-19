# Validação: evidência feita e homologação pendente

Data da preparação: 15/11/2026. Ambiente local Linux, Node 24.22.1, dependências fixadas no package-lock.json. O Windows/VS Code dos integrantes, Vercel, Render e Oracle ainda precisam ser verificados pelo grupo.

## Verificado nesta preparação

- TypeScript estrito, suíte de testes e build de produção executados com sucesso. A suíte inicial tinha 31 casos; a atualização v2 tem 46 (ver `VALIDACAO_V2.md`). Casos da base: cálculos, dados ausentes, datas, validações, ID e comportamento HTTP isolado.
- Em navegador: Home, menu mobile, navegação, formulário de contato vazio/inválido/válido, simulador válido e limite inválido. O contato prepara texto e não declara envio. Foi corrigida e coberta a mensagem de e-mail, antes confundida com data.
- Verificação de largura em 11 rotas × três viewports = 33 combinações, sem overflow horizontal no documento. Tamanhos exatos: 390×844, 768×1024 e 1440×900. Os estados de API indisponível foram usados nas rotas dependentes; isso não valida o layout com listas grandes reais.
- Capturas reais da Home em desktop e mobile para o material de apresentação. A página auxiliar de medição foi removida da versão distribuída.
- Ausência de URL Java mostra indisponibilidade explícita. Não há fallback de CRUD mockado/localStorage e não há confirmação falsa de gravação.

Testes HTTP usam Fetch substituído somente dentro de `tests/`; verificam comportamento da aplicação, não conectividade real com Java. Nenhum número de modelo de IA ou persistência remota foi inventado.

## Roteiro obrigatório quando a API chegar

| Caso | Ação | Resultado esperado | Estado |
| --- | --- | --- | --- |
| 1 | GET residências vazio | Estado vazio útil e CTA de cadastro | Pendente |
| 2 | Criar residência fictícia | POST 201, ID real e sucesso visível | Pendente |
| 3 | Recarregar /residencias | GET devolve o mesmo registro | Pendente |
| 4 | Registrar consumo SIMULADO | POST 201; valor no painel e Oracle | Pendente |
| 5 | Repetir residência/data | 409 e explicação; sem duplicação | Pendente |
| 6 | Corrigir registro | PUT 200; painel recalcula com dado confirmado | Pendente |
| 7 | Excluir registro de teste | Confirmação; DELETE 204; lista atualizada | Pendente |
| 8 | Criar/editar/remover meta | Status corretos; período e limites válidos | Pendente |
| 9 | Meta sobreposta | 409; preserva formulário e explica conflito | Pendente |
| 10 | Residência com filhos | 409; não exclui silenciosamente os filhos | Pendente |
| 11 | IDs inexistente e inválido | 404 remoto / validação de rota local | Pendente |
| 12 | Corpo inválido no Postman | 400 e mensagens por campo | Pendente |
| 13 | Falha de rede/500 | Mensagem útil, opção de tentar de novo; sem sucesso falso | Pendente |
| 14 | Demora/cancelamento | Feedback; abortar navegação; não duplicar escrita | Pendente |
| 15 | Falha de IA/dados insuficientes | Erro da análise sem esconder histórico | Pendente |
| 16 | Duas análises reais | Respostas de modelos treinados, modelo/versão documentados | Pendente |
| 17 | Vercel → Render | Preflight/CORS e HTTPS funcionam | Pendente |
| 18 | URL interna recarregada | /residencias/ID abre sem 404 da hospedagem | Pendente |
| 19 | Três tamanhos com dados | Sem corte, sobreposição nem rolagem horizontal indevida | Pendente |
| 20 | Anônima | GitHub, Vercel e YouTube acessíveis sem login | Pendente |

Não fazer os testes destrutivos com dados de pessoas reais. Criar uma residência demonstrativa e excluir apenas dados de teste combinados pelo grupo. Para demonstrar escrita, usar data disponível e consumo fictício; não repetir o mesmo POST sem confirmar se o servidor gravou após um timeout.

## Responsividade com dados

Em DevTools, usar exatamente as dimensões do enunciado. Percorrer toda a página em cada tamanho, inclusive rodapé, menu, formulários, erros e modal. Inserir nome longo, 31 registros, valores extensos válidos e nenhuma meta. Conferir foco por Tab/Shift+Tab, Escape no diálogo, label, contraste e legibilidade. Zoom 200% é uma checagem adicional recomendada, não uma dimensão extra da rubrica.

Registrar aqui para cada caso: data, integrante, commit, URL, passos, esperado, observado e evidência. Capturar DevTools Network sem tokens/senhas e, quando necessário, consulta Oracle apenas com IDs fictícios. Não copiar credenciais para documentação.

## Auditoria final

1. `npm ci`, `npm run check`, `npm run build` numa extração limpa.
2. Confirmar as URLs e identidade em README, integrantes.txt, entrega.json e Vercel.
3. Conferir cinco commits úteis por integrante na main e pelo menos quinze no total.
4. Verificar duração final e acesso do vídeo Front (até 3 minutos).
5. Só marcar flags em entrega.json após evidência real. `npm run check:delivery` é uma barreira documental, não um robô que certifica a API ou os commits.
6. Gerar ZIP, abrir e verificar fonte/config/README/assets; tamanho até 50 MB; sem node_modules, .env.local, .git, .vercel ou credenciais.
7. Representante envia no Portal e salva o comprovante. Manter URLs ativas até a correção/apresentação.
