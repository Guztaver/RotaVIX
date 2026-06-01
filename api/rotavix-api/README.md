# 🚌 RotaVIX — Backend API

API REST em **NestJS** para o sistema de transporte rodoviário RotaVIX.

## Stack

- **Framework**: NestJS (Node.js)
- **Validação**: class-validator + class-transformer
- **Runtime**: Node.js LTS

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/routes` | Listar todas as rotas |
| `GET` | `/api/routes/search` | Buscar rotas com filtros |
| `GET` | `/api/routes/:id` | Obter uma rota por ID |
| `POST` | `/api/bookings` | Criar nova reserva |

### Exemplo de busca

```bash
curl "http://localhost:3000/api/routes/search?origin=Vitória&destination=São%20Paulo&date=2026-06-15"
```

### Exemplo de reserva

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "routeId": 1,
    "passengerName": "João Silva",
    "passengerDocument": "12345678901",
    "seatNumber": 12
  }'
```

## Rotas mockadas

Dados simulados com **15 rotas** de ônibus entre as principais capitais brasileiras:

| Origem | Destino | Preços |
|--------|---------|--------|
| Vitória | São Paulo | R$ 159–199 |
| Vitória | Rio de Janeiro | R$ 109–134 |
| Vitória | Belo Horizonte | R$ 139–149 |
| Vitória | Salvador | R$ 229–249 |
| Vitória | Brasília | R$ 279 |

Tipos de ônibus: **Leito**, **Executivo** e **Convencional**.

## Rodando localmente

```bash
npm install
npm run start:dev
```

API disponível em `http://localhost:3000`

## Rodando com Docker

```bash
docker build -t rotavix-api .
docker run -p 3000:3000 rotavix-api
```
