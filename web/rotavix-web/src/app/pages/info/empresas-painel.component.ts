import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  styleUrl: './info-shared.scss',
  template: `
    <section class="info-page container">
      <a routerLink="/" class="info-page__back">← Voltar</a>
      <h1 class="info-page__title">Painel do parceiro</h1>
      <div class="info-page__content">
        <p>
          O painel do parceiro é a central de controle para viações cadastradas na RotaVIX.
          Gerencie suas rotas, monitore vendas e acompanhe o desempenho em tempo real.
        </p>

        <h2>Funcionalidades</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); margin-top: var(--space-4);">
          <div class="card">
            <h3>🚌 Rotas</h3>
            <p>Cadastre e gerencie rotas, horários, preços e tipos de ônibus.</p>
          </div>
          <div class="card">
            <h3>📊 Vendas</h3>
            <p>Acompanhe as reservas em tempo real e a taxa de ocupação.</p>
          </div>
          <div class="card">
            <h3>💳 Financeiro</h3>
            <p>Visualize relatórios de vendas e pagamentos recebidos.</p>
          </div>
          <div class="card">
            <h3>📱 Mobilidade</h3>
            <p>Painel responsivo, acessível de qualquer dispositivo.</p>
          </div>
        </div>

        <h2>Acesso</h2>
        <p>
          O painel está disponível apenas para viações parceiras cadastradas.
          Se sua empresa já é parceira, acesse com as credenciais fornecidas pela nossa equipe.
        </p>
        <p>
          Ainda não é parceiro?
          <a routerLink="/empresas/cadastro">Cadastre sua viação →</a>
        </p>
      </div>
    </section>
  `,
})
export class EmpresasPainelComponent {}
