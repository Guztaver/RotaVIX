import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  styleUrl: './info-shared.scss',
  template: `
    <section class="info-page container">
      <a routerLink="/" class="info-page__back">← Voltar</a>
      <h1 class="info-page__title">Cadastre sua viação</h1>
      <div class="info-page__content">
        <p>
          Faça parte da maior plataforma de comparação de passagens rodoviárias do Brasil.
          Cadastre sua empresa e alcance milhares de novos passageiros.
        </p>

        <div class="card">
          <h2>Vantagens para sua empresa</h2>
          <ul>
            <li>Aumente a visibilidade das suas rotas para milhares de passageiros.</li>
            <li>Gerencie ocupação e vendas em tempo real pelo painel do parceiro.</li>
            <li>Receba pagamentos de forma segura e automatizada.</li>
            <li>Suporte dedicado para integração e operação.</li>
            <li>API completa para integrar com seu sistema de vendas.</li>
          </ul>
        </div>

        <h2>Como funciona</h2>
        <ol>
          <li>Preencha o formulário de cadastro com os dados da sua empresa.</li>
          <li>Nossa equipe analisará a solicitação em até 5 dias úteis.</li>
          <li>Após aprovação, você terá acesso ao painel do parceiro.</li>
          <li>Cadastre suas rotas, horários e preços.</li>
          <li>Comece a receber reservas!</li>
        </ol>

        <p style="margin-top: var(--space-6);">
          <strong>Interessado?</strong> Entre em contato pelo e-mail
          <a href="mailto:parcerias@rotavix.com.br">parcerias&#64;rotavix.com.br</a>
          e nossa equipe comercial entrará em contato.
        </p>
      </div>
    </section>
  `,
})
export class EmpresasCadastroComponent {}
