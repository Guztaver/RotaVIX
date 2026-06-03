import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  styleUrl: './info-shared.scss',
  template: `
    <section class="info-page container">
      <a routerLink="/" class="info-page__back">← Voltar</a>
      <h1 class="info-page__title">Meus dados</h1>
      <div class="info-page__content">
        @if (auth.username(); as name) {
          <div class="card">
            <p><strong>Nome de usuário:</strong> {{ name }}</p>
            <p style="margin-top: var(--space-2)">
              Este nome é usado para vincular suas reservas ao seu perfil.
              Para alterar, clique em "Sair" no menu superior e entre com um novo nome.
            </p>
          </div>
          <p>
            <a routerLink="/reservas">Ver minhas reservas →</a>
          </p>
        } @else {
          <div class="card" style="text-align: center; padding: var(--space-8);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-light)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto var(--space-4);">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <p>Você não está identificado.</p>
            <p style="margin-top: var(--space-2);">
              Clique em <strong>"Entrar"</strong> no menu superior para criar um nome de usuário e acessar seus dados.
            </p>
          </div>
        }
      </div>
    </section>
  `,
})
export class MeusDadosComponent {
  readonly auth = inject(AuthService);
}
