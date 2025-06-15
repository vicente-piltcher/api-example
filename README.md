# SolidMvcNode
Api para exemplo de implementação seguindo os conceitos de MVC e Solid
* Typescript
* NodeJS
* Prisma
* SQlite

# Estrutura de Pastas
/prisma                                                         # esquema do prisma e as migrations
/src
├── /api
│   ├── /express
│   │   ├── /controllers                                        # Contém os arquivos com a implementação do controller de cada entidade/serviço
│   │   │   ├── <entity_name>.controller.ts                     # Controller de uma entidade específica
│   │   ├── api.express.ts                                      # Cria a classe para a API Express
├── api.ts                                                      # Arquivo que cria a interface da API que será usada na classe (dentro do arquivo api.express.ts)
├── /entities                                                   # Contém as entidades que representam o modelo
│   ├── <entity_name>.ts                                        # Cria a classe para a entidade
├── /repositories                                               # Contém os arquivos que definem os repositórios para cada entidade/serviço, que faz a persistência de dados
│   ├── /<entity_name>                                          # pasta do repositório da entidade / serviço
│   │   ├── <entity_name>.repository.ts                         # Cria a interface para o repositório com o diretório de métodos que estarão acessíveis para lidar com a aquela classe
│   │   ├── <entity_name>.repository.implementation.ts          # Classe de implementação dos métodos do repositório genérica, independente do ORM. Receber como parâmetro o repositorio do ORM implementado
│   │   ├── /prisma                                             # Armazena a implementação do reposotório propriamente dita, que depende do ORM ou ferramenta de interface com o banco de dados
│   │   │   ├── <entity_name>.repository.prisma.ts              # Implementação dos métodos do respositório para a ferramenta de integração (exemplo .prisma)
├── /services                                                   # Contém os arquivos que definem os serviços que implementam os casos de uso do sistema
│   ├── /<entity_name>                                          # pasta do repositório da entidade / serviço
│   │   ├── <entity_name>.service.ts                            # Cria a interface e os DTOs para o serviço com os métodos dos casos de uso
│   │   ├── /implementation                                     # Armazena a implementação da classe do serviço
│   │   │   ├── <entity_name>.service.implementation.ts         # Implementação da classe de serviço e seus métodos
├── /util                                                       # Métodos, classes e funções genéricas como validações de data, etc
│   ├── /functions                                              # funçoes de uso genérico
│   ├── /types                                                  # tipos de dados genéricos (retorno de erros, exceçoes, logs, etc)
│   ├── prisma.util.ts                                          # configuração do prisma client
├── main.ts            

# Descrição
## Controllers
* Orquestram a aplicação, recebendo os requests, manipulam os dados quando necessário, e disparam os serviços adequados. 
* Dentro do controller é instanciada a classe de implementação do repositório que é usada para instanciar a classe de implementação do serviço.
## Services
* Implementam os casos de uso da aplicação
* A classe do serviço é instanciada recebendo a instância da classe do repositório para ter acesso aos métodos mais basicos de integração com a base de dados, com o CRM, etc.
* Usa DTOs para se comunicar com o Controller 
## Repositories
* Está mais ligado aos objetos concretos 
* Faz a persistência de dados e acessos externos (apis de terceiros, Crm, etc)
* O repository tem duas camadas, criadas para diminuir o impacto caso se deseje trocar a tecnologia que implementa a persistência.
    * RepositoryImplementation que implementa os métodos genéricos que serão chamados externamente pelos demais módulos e chama os métodos da camada mais interna 
    * Repository<ORM> que efetivamente implementa os métodos do repositório chamando os métodos e serviços do pacote externo
* Usa um ORM para se comunicar com o banco de dados, DTOs e Adapters para se comunicar com interfaces externas
## Middlewares
* Funções intermediárias que interceptam as chamadas HTTP antes que elas cheguem aos controladores
    * auth.middleware.ts: valida se a rota pode ser acessada através do token fornecido no request
## Factories
* Armazena as classes de factory para centralizar a instanciação de outros objetos garantindo consistência e evitando duplicação de código
## Pasta api-test
* Requisições HTTP para testes das rotas da Api usando o pacote REST Client

# Módulos Basicos
## Token: métodos para criação e validação de tokens
* Estrutura: 
    * /src/services/token
        * token.service.implementation expõe os métodos e implementa a classe TokenService, chamando diretamente os métodos do token.repository.<tech>.implementation
            * generateToken
            * verifyToken
            * decodeToken
    * /src/repository/token 
        * token.repository.<tech>.implementation: implementa os métodos mais básicos necessários para o servico do token. 
            * Faz acesso direto aos métodos e classes da <tech>, nesse caso a implementação está feita com JWT Token e BCrypt para criptografia de senhas.
            * Usa a secretKey definida no .ENV para gerar o token a partir do userid e senha
            * generatePasswordHash
            * generateToken
            * verifyToken
            * decodeToken
## Auth: métodos para login de usuário, validação de acesso as rotas por token
* Usa os serviços do Token Service como generateToken, verifyToken, decodeToken, validação de senha
* Métodos: 
    * Login de usuário
    * Refresh Token
* Middleware: auth.middleware.ts
    * implementa a validação do token fornecido na requisição http
* Estrututura:
    * /src/service/auth
        * auth.service.implementation implementa a interface auth.service e chama os métodos do auth.repository
            * refreshToken
            * login
    * /src/repository/auth
        * auth.repository.jwt.implementation implementa
    * /src/api/express/controllers/auth.controller.ts
        * implementa as rotas de login e refresh-token

## Logs: criação de um log usando o winston, e método de createLog
* Serviço do LogService createLog (Singleton)
* Métodos: 
    * createLog
* Estrututura:
    * /src/service/log
        * log.service.implementation implementa a interface log.service e chama os métodos do log.repository
            * createLog
    * /src/repository/log
        * log.repository.implementation.winston implementa o log usando o winston
    * /src/factories/baseFactories
        * log.service.factory.ts implementa a instanciação do LogService criando primeiro o repository e depois o logService que recebe o repository como parâmetro

## Cache: criação de uma cache usando o node-cache (AppCacheService / AppCacheRepository)
* Serviço de Cache 
* Métodos: 
    * set, get, del, flushAll, listAll
* Estrututura:
    * /src/service/cache
        * cache.service.implementation implementa a interface cache.service e chama os métodos do cache.repository
            * set, get, del, flushAll, listAll
    * /src/repository/cache
        * cache.repository.implementation.node.cache implementa o cache usando o pacote node-cache
        * métodos do repositorio: set, get, del, flushAll, e keys (que obtem todas as chaves armazenadas na cache)



## User: métodos CRUD para o módulo de usuários
* Estrutura:
    * /src/entities/users.ts: implementa a classe User
    * /src/repository/users/prisma/user.repository.prisma.ts: implementa a camada de persistência de dados da entidade User através do ORM Prisma.
    * /src/services/users/user.service.implementation.ts: implemente os métodos do serviço de User que acessam os métodos da camada de persistência repository.
        * register
        * listAll
        * update
        * delete

## Errors
* appErrorsList.ts: é a lista de códigos de retorno padrão da API, com statusCode e Mensagem
* Classe ApiError: classe instanciada para obter os códigos de retorno padrão.  


## Utils
* Functions: funções genéricas para tratamento de datas, strings, etc, que não pertencem a uma classe específica e podem ser usadas na aplicação em geral.
* genericReturnResult: classe para padronizar o retorno da camada de serviço para os controllers ou métodos externos chamadores. Usa o modulo de Errors.


## Pontos de Atenção
* Versão do Pacote Chalk que funciona com o TypeScript é a 4.1.2, as mais recentes deram problema nessa instalação ao executar. O chalk é usado nos Logs.

## Pendente implementar 
* Tratamento de exceções 
* Retorno padrão: camadas mais internas podem dar throw error, mas a camada mais externa (serviço) tem que capturar e tratar com o try catch.
* Refatorar para que cada módulo seja independente com sua própria estrutura de pastas, facilitando a instalação em novos projetos
* Incluir versionamento do módulo básico, com pastas nomeadas V1, V2, etc, e o mesmo vale para as rotas dos controllers
* Melhorar os módulo de Auth, Token e Cache, usando injeção de dependência para o repositório para reduzir a dependência do PACOTE usado para implementação (JWT, Node-Cache, etc), similar 
    ao que está feito para Users e LOGs
* Incluir o básico de segurança na API (cors, helmet, verifyToken nas rotas de acesso aos dados, etc....), rate-limit. Avaliar pacote de segurança do express e opções do helmet.

 

