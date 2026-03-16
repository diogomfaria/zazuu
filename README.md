# Zazuu Full Stack

Projeto full stack com API em Nest, frontend em Next e banco PostgreSQL. Este README descreve a arquitetura, execucao local e via Docker, variaveis de ambiente, e referencias da API.

## Stack

- Backend: NestJS + Prisma + PostgreSQL
- Frontend: Next.js (App Router) + Chakra UI
- Infra: Docker + docker-compose

## Estrutura

- `backend/` API Nest
- `frontend/` App Next
- `docker-compose.yml` orquestracao de servicos
- `postman_collection.json` colecao Postman com rotas da API

## Requisitos

- Node.js 20+
- pnpm 9+
- Docker e Docker Compose (opcional, recomendado)

## Variaveis de ambiente (raiz)

O `docker-compose.yml` usa o arquivo `.env` na raiz.

```
POSTGRES_USER=root
POSTGRES_PASSWORD=rootpassword
POSTGRES_DB=zazuudb
POSTGRES_PORT=5432

API_PORT=3001
JWT_SECRET=zazuu_super_secret_key_2026_enterprise

FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Notas:
- `JWT_SECRET` deve ser alterado em producao.
- `NEXT_PUBLIC_API_URL` e injetado no build do frontend.

## Rodando com Docker (recomendado)

Build e subida dos servicos:

```
docker compose up --build
```

Servicos expostos:
- API: `http://localhost:3001`
- Frontend: `http://localhost:3000`
- Postgres: `localhost:5432`

Se precisar reconstruir somente a API:

```
docker compose build --no-cache api
docker compose up -d api
```

### Migracoes Prisma no container

As migracoes nao rodam automaticamente. Para aplicar:

```
docker compose exec api pnpm exec prisma migrate deploy
```

Se nao houver migracoes, crie localmente e depois aplique:

```
cd backend
pnpm exec prisma migrate dev
```

## Rodando localmente (sem Docker)

### Backend

```
cd backend
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm run start:dev
```

A API roda em `http://localhost:3001`.

### Frontend

```
cd frontend
pnpm install
pnpm run dev
```

O frontend roda em `http://localhost:3000` e consome `NEXT_PUBLIC_API_URL`.

## Rotas da API

Base URL: `http://localhost:3001`

Publicas:
- `GET /` healthcheck (retorna `Hello World!`)
- `POST /auth/register`
- `POST /auth/login`

Protegidas (Bearer Token):
- `POST /products`
- `GET /products`
- `PUT /products/:id`
- `DELETE /products/:id`

### Colecao Postman

Importe o arquivo `postman_collection.json` no Postman e configure:
- `baseUrl` (ex: `http://localhost:3001`)
- `token` (JWT retornado no login)
- `productId` (id de produto existente)

## Dockerfiles

- Backend: multi-stage build com build TypeScript + runtime leve.
- Frontend: build Next com export estatico e runtime Nginx.

## Troubleshooting

- Porta ocupada (ex: 3001): altere `API_PORT` no `.env` e atualize `NEXT_PUBLIC_API_URL`.
- API reiniciando com erro `Cannot find module /app/dist/main`: reconstruir a imagem da API.
- Banco indisponivel: aguarde o healthcheck do Postgres antes da API subir.

## Licenca

Projeto para desafio tecnico.
