<p align="center">
  <img src="https://raw.githubusercontent.com/Guztaver/RotaVIX/main/web/rotavix-web/public/favicon.ico" width="80" alt="RotaVIX" />
</p>

<h1 align="center">🚌 RotaVIX</h1>

<p align="center">
  <strong>Aplicativo de transporte rodoviário</strong><br>
  Busca de passagens, reservas de assentos e integração com API.
</p>

<p align="center">
  <a href="https://github.com/Guztaver/RotaVIX/actions"><img src="https://github.com/Guztaver/RotaVIX/actions/workflows/deploy.yml/badge.svg" alt="CI/CD"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

---

## ✨ Funcionalidades

- 🔍 **Busca inteligente** — Encontre passagens por origem, destino e data
- 🎫 **Listagem de rotas** — Cards com horários, preços, empresa e tipo de ônibus
- 💺 **Seleção de assento** — Escolha visual do assento no ônibus
- 💳 **Checkout completo** — Formulário de passageiro, pagamento (Pix/Cartão/Boleto)
- 🐳 **Docker pronto** — Deploy com um comando via Docker Compose
- 🔄 **CI/CD** — GitHub Actions com build, lint e push para GHCR

## 🏗️ Arquitetura

```
┌──────────────────────────────────────┐
│            Docker Compose            │
│                                      │
│  ┌──────────┐     ┌──────────────┐   │
│  │  Nginx   │────▶│  NestJS API  │   │
│  │ (Angular)│◀────│   (porta 3000)│   │
│  │ (porta 80)│    └──────────────┘   │
│  └──────────┘                        │
└──────────────────────────────────────┘
```

| Camada | Tecnologia | Diretório |
|--------|-----------|-----------|
| Frontend | Angular 19+ | `web/rotavix-web/` |
| Backend | NestJS | `api/rotavix-api/` |
| Proxy | Nginx | `web/rotavix-web/nginx.conf` |
| Infra | Docker Compose | `docker-compose.yml` |

## 🚀 Deploy rápido

```bash
# Subir tudo com Docker Compose
docker-compose up --build -d

# Acessar:
#   Frontend → http://localhost
#   Backend  → http://localhost:3000/api/routes
```

## 🧑‍💻 Desenvolvimento local

```bash
# Terminal 1 — Backend
cd api/rotavix-api && npm install && npm run start:dev

# Terminal 2 — Frontend
cd web/rotavix-web && npm install && npm start
```

## 📁 Estrutura do projeto

```
RotaVIX/
├── api/rotavix-api/          # Backend NestJS
│   ├── Dockerfile
│   └── src/
│       └── routes/           # Endpoints da API
├── web/rotavix-web/          # Frontend Angular
│   ├── Dockerfile
│   ├── nginx.conf            # Config Nginx + proxy reverso
│   └── src/
│       ├── app/
│       │   ├── components/   # Header, etc
│       │   ├── pages/        # Home, Routes, Booking
│       │   └── services/     # Integração API
│       └── environments/     # Dev vs Prod
├── docker-compose.yml
├── .github/workflows/deploy.yml
└── README.md
```

## 📖 Documentação

- [Documentação da API](./api/rotavix-api/README.md)
- [Documentação do Frontend](./web/rotavix-web/README.md)
- [Guia de contribuição](./CONTRIBUTING.md)
- [Código de conduta](./CODE_OF_CONDUCT.md)

## 👥 Integrantes

| Nome | RA |
|------|-----|
| Integrante 1 | — |
| Integrante 2 | — |
| Integrante 3 | — |
| Integrante 4 | — |
| Integrante 5 | — |

---

<p align="center">
  Desenvolvido para a disciplina <strong>Projeto de Interfaces Gráficas para Web</strong><br>
  Entrega: 08/06/2026
</p>
