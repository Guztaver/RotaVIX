# 🚌 RotaVIX — Frontend Web

Interface web em **Angular 19+** para o sistema de transporte rodoviário RotaVIX, implementada a partir de protótipo de alta fidelidade no Figma.

## Stack

- **Framework**: Angular 19 (standalone components)
- **Estilização**: SCSS com Design System próprio
- **Formulários**: Reactive Forms com validação
- **Estado**: Signals + RxJS
- **Build**: esbuild (via `@angular/build`)

## Design System

| Token | Valor |
|-------|-------|
| Primary | `#013271` |
| Accent | `#76BE3F` |
| Background | `#FEF7FF` |
| Cards | `#FCF1FE` |
| Dark Surface | `#2C2C2C` |
| Font | System font stack |

## Páginas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | Home | Busca de passagens (origem, destino, data) |
| `/routes` | Routes | Listagem de rotas disponíveis em cards |
| `/booking/:id` | Booking | Reserva com formulário, assento e pagamento |

## Rodando localmente

```bash
npm install
npm start
```

Acesse `http://localhost:4200`

> ⚠️ O backend precisa estar rodando em `http://localhost:3000`

## Rodando com Docker

```bash
docker build -t rotavix-web .
docker run -p 80:80 rotavix-web
```

O Nginx serve o Angular e faz proxy reverso de `/api/*` para o backend.

## Estrutura de diretórios

```
src/
├── app/
│   ├── components/header/    # Barra de navegação superior
│   ├── pages/
│   │   ├── home/             # Página inicial / busca
│   │   ├── routes/           # Lista de rotas encontradas
│   │   └── booking/          # Checkout e reserva
│   ├── services/             # Serviço HTTP + estado
│   └── app.routes.ts         # Configuração de rotas
├── environments/             # Dev vs Prod (URL da API)
└── styles.scss               # Design tokens e utilitários
```
