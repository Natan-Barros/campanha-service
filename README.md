# Campanha Service

## Descrição

Este projeto é um serviço backend para gerenciamento de campanhas, desenvolvido com **Fastify**, **Knex** e **PostgreSQL**. Ele permite criar, listar, atualizar e excluir campanhas, garantindo regras de validação e consistência dos dados.

## Tecnologias Utilizadas

- **Node.js**
- **Fastify** (Framework Web)
- **Knex.js** (Query Builder para banco de dados)
- **PostgreSQL** (Banco de Dados)
- **Docker & Docker Compose** (Containerização do banco de dados)
- **Zod** (Validação de entrada)
- **Vitest & Supertest** (Testes)

---

## Como Executar o Projeto

### 1. Subir o Banco de Dados com Docker

Antes de iniciar a aplicação, execute o seguinte comando para inicializar o banco de dados:

```sh
docker-compose up -d
```

Isso irá criar e rodar um contêiner PostgreSQL na porta **5432**.

### 2. Instalar Dependências

Caso ainda não tenha instalado as dependências do projeto, execute:

```sh
npm install
```

### 3. Executar Migrações do Banco de Dados

Após o banco estar rodando, execute as migrações para criar as tabelas necessárias:

```sh
npm run knex:migrate:latest
```

Caso precise reverter a última migração, utilize:

```sh
npm run knex:migrate:rollback
```

### 4. Iniciar a Aplicação

Com tudo configurado, inicie o servidor:

```sh
npm run dev
```

A API estará disponível em **[http://localhost:3333](http://localhost:3333)**.

---

## Testes

Para executar os testes automatizados:

```sh
npm run test
```

Isso irá rodar os testes unitários e de integração usando **Vitest** e **Supertest**.

---

## Rotas da API

### Criar uma Campanha

```http
POST /
```

#### Corpo da Requisição (JSON)

```json
{
  "nome": "Campanha Exemplo",
  "dataInicio": "2025-03-30T00:00:00.000Z",
  "dataFim": "2025-04-30T23:59:59.000Z",
  "categoria": "Marketing"
}
```

### Listar Campanhas

```http
GET /
```

### Atualizar Campanha

```http
PUT /:id
```

#### Corpo da Requisição (JSON)

```json
{
  "nome": "Novo Nome",
  "status": "pausada"
}
```

### Excluir

```http
DELETE /:id
```