> **Integração atual** · Para executar a API recebida e testar o front v2 no Windows, siga [LEIA_INTEGRACAO_JAVA.md](LEIA_INTEGRACAO_JAVA.md). Os exemplos abaixo registram o planejamento de 15/11. O Java entregue lê ORACLE_URL, ORACLE_USER e ORACLE_PASSWORD.

# EcoLar — conectar o front, o Java e o Oracle

Atualização de 15/11/2026. Este guia prepara a integração; não comprova uma conexão executada. A API Java, suas credenciais e o DDL executado no Oracle não foram disponibilizados nesta atualização.

## 1. Entender quem se conecta a quem

**React no navegador → Fetch/HTTP → API Java → DAO/JDBC → Oracle.**

O front envia e recebe JSON. O Java transforma os DTOs em operações no banco. O Oracle guarda os registros. Não se instala `oracledb` no React, não se usa JDBC no navegador e não se coloca senha Oracle em variável `VITE_`. Essas variáveis são públicas no código enviado ao navegador.

O banco já existir é um avanço, mas ainda precisamos de Java acessando esse mesmo banco, dos endpoints publicados e de CORS permitindo o domínio do front. O simulador matemático e a calculadora de leituras funcionam sem essa conexão. Cadastro, histórico, metas e análises remotas dependem dela.

## 2. O que vocês podem conferir agora no Oracle

Yan deve abrir no SQL Developer a conexão que já usou para criar o banco. Em suas propriedades, conferir host, porta e se a conexão usa **Service name** ou **SID**. Guardar usuário e senha fora do GitHub. Não enviar senha pelo chat, vídeo ou print.

Na planilha SQL dessa conexão, executar somente estas consultas de diagnóstico:

```sql
SELECT USER FROM dual;
SELECT SYS_CONTEXT('USERENV', 'SERVICE_NAME') AS servico FROM dual;
SELECT table_name FROM user_tables ORDER BY table_name;
SELECT sequence_name FROM user_sequences ORDER BY sequence_name;
SELECT table_name, column_name, data_type, nullable
FROM user_tab_columns
ORDER BY table_name, column_id;
```

Resultado esperado: usuário/schema do grupo, tabelas e sequences já criadas. Compartilhar com Diego o DDL e os nomes de tabelas/colunas/constraints/sequences, sem credenciais. Não executar novamente um script de criação que apague tabelas ou dados existentes.

Alinhar as três entidades usadas pelo front:

| Entidade do front | Conferir no banco e no Java |
| --- | --- |
| Residência | ID, nome, quantidade de moradores, tarifa por kWh |
| Consumo diário | ID, FK da residência, data, consumo em kWh, origem |
| Meta | ID, FK da residência, início, fim, limite em kWh |

Os nomes físicos podem ser diferentes dos nomes JSON. O DAO faz o mapeamento. Não renomear tabelas para combinar com o front sem analisar o banco inteiro. Conferir a unicidade de residência + data se a regra for um registro diário por residência. É importante rejeitar duplicidade com 409, não somar acidentalmente dois lançamentos do mesmo dia.

## 3. Diego conecta o Java ao Oracle

Trabalhar no repositório **Java**, não na pasta `src` do React. Manter Spring Boot e as versões do projeto Java. Conferir no `pom.xml` o starter JDBC e o driver Oracle compatível com a versão do JDK e com o banco. Se as versões já são gerenciadas pelo projeto, preservá-las. A escolha de `ojdbc11`/outro artefato deve seguir a matriz oficial; não trocar o JDK ou o driver por tentativa.

Em `src/main/resources/application.properties` do Java:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
```

Os nomes à esquerda são configuração do Spring; os nomes dentro de `${...}` são variáveis do ambiente onde o Java roda. No Render, configurar no ambiente do serviço Java. Localmente, usar as variáveis da configuração de execução da IDE. Um arquivo `.env` na pasta não é carregado automaticamente por todo projeto Java.

Formatos possíveis da URL, sem usuário/senha embutidos:

```text
Service name: jdbc:oracle:thin:@//HOST:PORTA/SERVICE_NAME
SID:          jdbc:oracle:thin:@HOST:PORTA:SID
```

Usar os valores reais da conexão validada no SQL Developer. `HOST`, `PORTA`, `SERVICE_NAME` e `SID` são marcadores; não são dados da FIAP. Não trocar SID por service name apenas mudando a barra: são configurações diferentes.

Para iniciar pelo Git Bash, na pasta Java com Maven Wrapper, uma opção que não registra a senha no histórico é:

```bash
read -r -p "URL JDBC: " DB_URL
read -r -p "Usuário Oracle: " DB_USER
read -r -s -p "Senha Oracle: " DB_PASSWORD
printf '\n'
export DB_URL DB_USER DB_PASSWORD
./mvnw spring-boot:run
```

Se o projeto só disponibilizar o wrapper Windows, usar `./mvnw.cmd spring-boot:run`. Ao encerrar o processo, limpar as variáveis desse terminal com `unset DB_URL DB_USER DB_PASSWORD`.

No código Java, respeitar a arquitetura solicitada no PDF: `model`, `dao`, `dto`, `controller`, `exception`, `handler`, `config`; `service` é opcional. Um DAO por entidade, `DataSource` recebido pelo construtor e `PreparedStatement`. Não introduzir JPA, Hibernate ou Spring Data.

Exemplo didático de uma consulta de conexão, para adaptar ao pacote do Java e usar em teste de diagnóstico, sem criar um endpoint público com informações do banco:

```java
import java.sql.SQLException;
import javax.sql.DataSource;

public final class ConexaoDiagnostico {
    private final DataSource dataSource;

    public ConexaoDiagnostico(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public boolean verificar() throws SQLException {
        try (var connection = dataSource.getConnection();
             var statement = connection.prepareStatement("SELECT 1 FROM dual");
             var result = statement.executeQuery()) {
            return result.next() && result.getInt(1) == 1;
        }
    }
}
```

A aplicação/teste deve receber o `DataSource` configurado pelo Spring e instanciar/injetar esse diagnóstico. Isso testa conexão; não implementa CRUD. Nos DAOs reais, usar parâmetros `?` e `setXxx`, fechar os recursos com try-with-resources, mapear o resultado para o modelo e garantir commit/rollback da transação de escrita. DTOs de entrada/saída, ModelMapper, Bean Validation e tratamento global de erros seguem o enunciado do Java.

Se funcionar localmente, mas falhar no Render, verificar conectividade do ambiente remoto até o host/porta do Oracle e eventuais requisitos da FIAP. Não resolver expondo o Oracle no navegador. Não desativar validação TLS para contornar um erro.

## 4. Alinhar o contrato antes de ligar o front

Enviar `CONTRATO_API.md` e `openapi.proposto.json` a Diego. São propostas, não uma declaração de que os controllers já existem. Confrontar com os DTOs e endpoints reais. Se o Java tiver nomes diferentes, adaptar conscientemente `src/services/ecolar.ts` e `src/types/domain.ts` (ou uma função de conversão no serviço).

| Operação | Rota proposta | Resposta esperada |
| --- | --- | --- |
| Listar residências | GET `/residencias` | 200 e array, inclusive `[]` quando vazio |
| Criar residência | POST `/residencias` | 201, Location e JSON com ID |
| Consultar/editar/excluir residência | GET/PUT/DELETE `/residencias/{id}` | 200/200/204 |
| Listar/criar consumos | GET/POST `/residencias/{id}/consumos` | 200 array / 201 objeto |
| Consultar/editar/excluir consumo | GET/PUT/DELETE `/consumos/{id}` | 200/200/204 |
| Listar/criar metas | GET/POST `/residencias/{id}/metas` | 200 array / 201 objeto |
| Editar/excluir meta | PUT/DELETE `/metas/{id}` | 200/204 |

Os PUT de consumo e meta enviam `residenciaId` junto dos campos. O Java deve conferir vínculo/ID e rejeitar incoerências. O front espera corpo JSON em POST/PUT; não aceitar 204 silenciosamente como registro criado. Datas `YYYY-MM-DD`, números JSON com ponto, nomes/capitalização exatos. Não retornar número como texto. Ver contrato para IA, erros e corpos completos.

Exemplo de residência retornada pela API:

```json
{"id":1,"nome":"Casa de demonstração","quantidadeMoradores":3,"tarifaKwh":0.9}
```

Exemplo de corpo enviado ao cadastrar consumo na residência 1:

```json
{"data":"2026-11-15","consumoKwh":7.5,"origem":"SIMULADO"}
```

Esperar 400 para validação, 404 para ausência, 409 para conflito e mensagem genérica em 500. Não devolver stack trace, SQL ou credenciais ao consumidor.

## 5. Configurar CORS no Java

O navegador precisa receber permissão da API para chamadas vindas do front. Usar a origem real, incluindo protocolo e porta, sem caminho e sem barra final. CORS não autentica usuários e não transforma dados públicos em privados.

Exemplo de configuração global para adaptar ao pacote e aos endpoints do grupo:

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    private final String[] origins;

    public CorsConfig(@Value("${app.cors.allowed-origins}") String[] origins) {
        this.origins = origins;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(origins)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("Content-Type", "Accept");
    }
}
```

No `application.properties` do Java:

```properties
app.cors.allowed-origins=${FRONTEND_ORIGINS:http://localhost:5173}
```

No Render, `FRONTEND_ORIGINS` recebe a origem definitiva da Vercel; acrescentar `http://localhost:5173` separado por vírgula quando o grupo precisar testar localmente contra a API remota. Se já houver Spring Security, revisar sua integração com CORS; este exemplo isolado não configura segurança adicional.

## 6. Configurar o front quando o Java estiver pronto

Receber de Diego a **URL HTTPS real**, prefixo base (`/api`, se existir), exemplos JSON e confirmação do Oracle. Na pasta `ecolar-frontend`, criar `.env.local` somente se ainda não existir:

```bash
test -f .env.local || cp .env.example .env.local
code .env.local
```

Preencher no editor:

```dotenv
VITE_API_BASE_URL=https://URL-REAL-DA-API
```

Substituir o marcador. Se o GET completo é `https://api-do-grupo.example/api/residencias`, a base é `https://api-do-grupo.example/api`. Não colocar `/residencias` na base e não repetir `/api`. A configuração local pode usar `http://localhost:8080` se essa for a porta real do Java, mas a entrega exige API remota.

Parar o Vite com Ctrl+C e executar novamente:

```bash
npm run dev
```

Na Vercel, configurar a mesma variável no projeto e gerar novo deploy. Como é incorporada ao build, alterar apenas a variável sem reconstruir não atualiza um bundle já publicado. Seguir também `DEPLOY_E_ENTREGA.md`: preset Vite, build `npm run build`, saída `dist`, rotas SPA preservadas por `vercel.json`.

## 7. Provar a integração do começo ao fim

1. Consultar as residências pelo site e conferir o GET na aba Network.
2. Criar uma residência fictícia. Conferir POST 201, ID e Location.
3. Recarregar a página: a residência deve continuar aparecendo.
4. No SQL Developer, consultar a tabela real de residências pelo ID retornado; conferir os valores gravados. Usar o nome físico do DDL, sem inventar SQL sobre uma tabela presumida.
5. Registrar consumo fictício; conferir POST, recarga, FK e dados no Oracle.
6. Editar o consumo e criar uma meta. Conferir cálculos e cobertura parcial. Um dia sem registro não é zero.
7. Testar formulário inválido, data duplicada, ID inexistente, API indisponível e cancelamento da exclusão. Não apagar registros reais para testar.
8. Repetir no domínio Vercel em 390×844, 768×1024 e 1440×900. Abrir uma rota interna diretamente e apertar F5.
9. Registrar evidências reais em `docs/VALIDACAO.md`; somente então atualizar `entrega.json`. Nunca marcar Oracle/GET/POST como concluídos porque um teste com respostas simuladas passou.

## Erros mais comuns

| Sintoma | O que conferir |
| --- | --- |
| Serviço ainda indisponível | Variável do front vazia; reinício do Vite/redeploy |
| Network/CORS | API acessível, origem correta, OPTIONS, métodos/headers |
| 404 | Prefixo, caminho, ID e endpoints reais |
| Formato inesperado | JSON/DTO, tipos numéricos, enum e corpo do POST/PUT |
| 500 | Logs privados do Java, conexão Oracle, SQL, sequences e constraints |
| Existe no SQL Developer, não no Java | Usuário/schema, ambiente e URL JDBC usados pelo Java |
| POST aparece e some ao recarregar | Persistência/commit real, instância e banco corretos |

## Fontes consultadas

Enunciado FIAP GS 2026/2, Java pp. 47–56 e Front pp. 58–74. Documentação oficial consultada em 15/11/2026:

- https://docs.spring.io/spring-boot/reference/data/sql.html
- https://www.oracle.com/database/technologies/faq-jdbc.html
- https://spring.io/guides/gs/rest-service-cors
- https://vite.dev/guide/env-and-mode

Ajustar os exemplos à versão efetiva do Java; o repositório Java não foi inspecionado nesta atualização.
