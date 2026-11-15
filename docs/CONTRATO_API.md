# Contrato proposto para integrar com Diego

**Não é documentação extraída de uma API existente.** Os anexos trazem o domínio e exemplos, mas não controllers, DTOs, Swagger ou URL real. Este contrato orienta a implementação do front e deve ser confrontado com o Java antes do deploy. O arquivo `openapi.proposto.json` é a versão legível por ferramentas. Nenhum endpoint aqui é declarado implementado no servidor.

## Arquitetura obrigatória e responsabilidades

React/Vite/TypeScript/Tailwind na Vercel usa Fetch para HTTP/JSON na API Java Spring Boot no Render. Java usa DataSource, DAO e PreparedStatement para JDBC no Oracle FIAP. O front nunca se conecta diretamente ao Oracle.

Dentro da API, o enunciado pede `model`, `dao`, `dto`, `controller`, `exception`, `handler`, `config` (p. 48). Um pacote `service` pode organizar regras, mas não substitui os obrigatórios. DTOs de entrada/saída com ModelMapper; Bean Validation e @Valid; handler com @RestControllerAdvice; CORS. JPA, Hibernate e Spring Data não podem substituir JDBC.

Três entidades do escopo: Residencia, ConsumoDiario e MetaConsumo. Residencia possui relações 1:N com consumo e meta. Outras tabelas do banco não exigem necessariamente telas de CRUD no front. IA: caminho proposto Java -> Flask -> modelos exportados. Python procedural é outro módulo, independente e com JSON.

## Convenções deste front

- Base em `VITE_API_BASE_URL`; caminhos abaixo relativos. Se o Java tiver `/api`, inclua na base, não duplique nas rotas.
- Números JSON são números, nunca textos com vírgula. Datas: `YYYY-MM-DD`, sem horário. kWh/dia e R$/kWh.
- Listas retornam arrays diretamente. Se o servidor usar `{content: [...]}`, adaptar o serviço e o schema explicitamente.
- IDs JSON: `id` e `residenciaId`. Nomes físicos Oracle `cd_`, `nm_`, `vl_`, `dt_` permanecem no banco/DAO. DTO faz a separação.
- Cadastro 201 + Location e JSON; atualização 200 + JSON; exclusão 204 sem corpo.
- Erros 400, 404, 405, 409 e 500 em JSON. O front não transforma erro em sucesso.

## Endpoints consumidos

| Método | Rota | Resposta | Uso |
| --- | --- | --- | --- |
| GET | /residencias | Residencia[] | Lista |
| POST | /residencias | Residencia, 201 | Cadastro |
| GET | /residencias/{id} | Residencia | Painel / formulários |
| PUT | /residencias/{id} | Residencia | Editar |
| DELETE | /residencias/{id} | 204 | Remover sem filhos |
| GET | /residencias/{id}/consumos | Consumo[] | Histórico |
| POST | /residencias/{id}/consumos | Consumo, 201 | Registrar |
| GET | /consumos/{id} | Consumo | Carregar edição |
| PUT | /consumos/{id} | Consumo | Corrigir |
| DELETE | /consumos/{id} | 204 | Remover |
| GET | /residencias/{id}/metas | Meta[] | Acompanhamento |
| POST | /residencias/{id}/metas | Meta, 201 | Criar |
| PUT | /metas/{id} | Meta | Editar |
| DELETE | /metas/{id} | 204 | Remover |
| POST | /residencias/{id}/previsao | Previsao | Integração IA proposta |
| POST | /residencias/{id}/padrao | Padrao | Integração IA proposta |

Java também precisa listar/buscar/cadastrar todos os recursos no seu CRUD completo, mesmo quando o front usa uma rota aninhada. Ex.: GET/POST /consumos, GET/POST /metas e GET /metas/{id}. Conferir rubrica Java p. 49.

## JSONs combinados

POST /residencias:

```json
{"nome":"Casa demonstrativa","quantidadeMoradores":3,"tarifaKwh":0.9}
```

Resposta:

```json
{"id":1,"nome":"Casa demonstrativa","quantidadeMoradores":3,"tarifaKwh":0.9}
```

POST /residencias/1/consumos:

```json
{"data":"2026-11-01","consumoKwh":7.5,"origem":"SIMULADO"}
```

Resposta:

```json
{"id":10,"residenciaId":1,"data":"2026-11-01","consumoKwh":7.5,"origem":"SIMULADO"}
```

PUT /consumos/10 usa os mesmos campos de entrada mais `residenciaId: 1`. A data inicial deve continuar editável respeitando a unicidade. Origem: MANUAL, IMPORTADO ou SIMULADO.

POST /residencias/1/metas:

```json
{"dataInicio":"2026-11-01","dataFim":"2026-11-30","limiteKwh":180}
```

Resposta: os mesmos campos mais `id` e `residenciaId`. PUT /metas/{id} acrescenta `residenciaId` à entrada.

Erro proposto:

```json
{"status":409,"codigo":"CONSUMO_DUPLICADO","mensagem":"Já existe um consumo para essa residência e data.","campos":{}}
```

Para campos inválidos, `campos` é mapa `{ "nomeDoCampo": "mensagem" }`, não lista. Adaptar explicitamente se o handler real for diferente.

Previsão proposta: `{ "dataAlvo": "2026-11-08", "consumoPrevistoKwh": 7.8, "modelo": "nome-versao-real" }`. Agrupamento: `{ "dataInicio": "2026-11-01", "dataFim": "2026-11-07", "grupo": 1, "interpretacao": "Texto derivado da análise do modelo", "modelo": "nome-versao-real" }`. Números de exemplo, não resultados obtidos. Os POSTs não enviam histórico pelo navegador; Java consulta Oracle e escolhe a janela conforme o modelo de Yan.

## Regras a preservar

Um consumo por residência/data; consumo >=0; moradores inteiros >0; tarifa >=0; datas reais sem futuro para consumo realizado; meta limite >0 e fim >= início; sem metas sobrepostas; não remover residência com filhos. Conflitos de negócio retornam 409. Checagem no navegador melhora UX, mas Java e restrições Oracle são a autoridade. Definir com Yan/Diego os mesmos máximos, escalas e comprimentos para não divergir.

Valores default não são inseridos na base automaticamente. Nos ensaios, criar registros fictícios pela API e manter origem SIMULADO. Um dado fictício persistido pelo Java pode testar integração real; isso é diferente de o front simular a API. Previsões fixas continuam inválidas como prova de modelo.

## CORS e HTTPS

Diego precisa liberar as origens exatas do Vite local e da URL pública Vercel, métodos GET/POST/PUT/DELETE/OPTIONS e cabeçalhos Accept/Content-Type. Se for usar previews, decidir quais origens permitir. `mode: no-cors` não resolve: impede ler a resposta. O front usa Fetch sem cookies ou tokens no MVP sem login. Se adicionarem autenticação, reavaliar CORS, credenciais e autorização.

A Vercel em HTTPS deve chamar API HTTPS. Preflight OPTIONS precisa funcionar, sem redirecionamento indevido. Expor Location em CORS se o front passar a ler esse cabeçalho; o atual utiliza o ID do JSON. Credenciais do Oracle ficam somente no ambiente Render.

## Sequência de homologação

1. Diego entrega URL Render, controllers/DTOs ou Swagger, JSONs reais de GET e POST e exemplo de erro. Sem senhas.
2. Comparar com `src/types/domain.ts` e `src/services/ecolar.ts`. Ajustar o contrato conscientemente.
3. No Postman/Insomnia, executar CRUD das três entidades e 400/404/409.
4. Definir `.env.local`, iniciar front, cadastrar residência, registrar consumo e recarregar. Conferir mesmo ID no Oracle.
5. Publicar front, permitir a origem Vercel, repetir o fluxo em janela anônima e atualizar uma rota interna.
6. Registrar data, URL, commit, IDs fictícios e evidências em VALIDACAO.md. Só então marcar integração concluída.

Para IA, confirmar endpoints, histórico, timeout e saídas com Yan. A falha de análise não deve impedir ler o histórico. O front cancela HTTP após 20 s; o plano de negócio propõe 15 s no serviço de IA. Ajustar para que Java encerre a chamada ao Flask antes do prazo do navegador. Cold start pode exigir nova consulta; não reenviar uma escrita sem verificar se ela já foi gravada.
