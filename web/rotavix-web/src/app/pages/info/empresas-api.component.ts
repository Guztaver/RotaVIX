import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  styleUrl: './info-shared.scss',
  template: `
    <section class="info-page container">
      <a routerLink="/" class="info-page__back">← Voltar</a>
      <h1 class="info-page__title">API para integração</h1>
      <div class="info-page__content">
        <p>
          Integre o sistema da sua viação diretamente com a RotaVIX através da nossa API REST.
          Automatize a gestão de rotas, disponibilidade e reservas.
        </p>

        <h2>Endpoints disponíveis</h2>

        <div class="card">
          <h3><code>GET /api/routes/search</code></h3>
          <p>Busca rotas por origem, destino e data.</p>
          <p><strong>Parâmetros:</strong> <code>origin</code>, <code>destination</code>, <code>date</code></p>
        </div>

        <div class="card">
          <h3><code>GET /api/routes/:id</code></h3>
          <p>Obtém detalhes de uma rota específica.</p>
        </div>

        <div class="card">
          <h3><code>POST /api/bookings</code></h3>
          <p>Cria uma nova reserva de passagem.</p>
          <p><strong>Body:</strong> <code>&#123; routeId, passengerName, passengerDocument, seatNumber, username? &#125;</code></p>
        </div>

        <div class="card">
          <h3><code>GET /api/bookings?username=xxx</code></h3>
          <p>Lista as reservas de um usuário específico.</p>
        </div>

        <h2>Autenticação</h2>
        <p>
          A API pública não requer autenticação para buscas e reservas.
          Para funcionalidades de parceiro (cadastro de rotas, relatórios), é necessário
          um token de acesso fornecido após o cadastro da viação.
        </p>

        <h2>Formato</h2>
        <p>Todas as respostas são em <strong>JSON</strong>. Requisições <code>POST</code> devem enviar os dados no corpo como JSON com <code>Content-Type: application/json</code>.</p>

        <p style="margin-top: var(--space-6);">
          <strong>Quer integrar?</strong> Entre em contato pelo e-mail
          <a href="mailto:api@rotavix.com.br">api&#64;rotavix.com.br</a>.
        </p>
      </div>
    </section>
  `,
})
export class EmpresasApiComponent {}
