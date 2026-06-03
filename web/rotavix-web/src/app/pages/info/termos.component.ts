import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  styleUrl: './info-shared.scss',
  template: `
    <section class="info-page container">
      <a routerLink="/" class="info-page__back">← Voltar</a>
      <h1 class="info-page__title">Termos de uso</h1>
      <div class="info-page__content">
        <p><strong>Última atualização:</strong> 01/06/2026</p>

        <h2>1. Aceitação dos termos</h2>
        <p>
          Ao utilizar a plataforma RotaVIX, você concorda com estes Termos de Uso.
          Caso não concorde, não utilize nossos serviços.
        </p>

        <h2>2. Serviços oferecidos</h2>
        <p>
          A RotaVIX atua como intermediária entre passageiros e empresas de transporte
          rodoviário, facilitando a busca, comparação e reserva de passagens. Não somos
          uma empresa de transporte e não operamos os ônibus.
        </p>

        <h2>3. Cadastro e responsabilidades</h2>
        <p>
          Para utilizar nossos serviços, você pode se identificar com um nome de usuário.
          Você é responsável por fornecer informações verdadeiras e manter seus dados atualizados.
        </p>

        <h2>4. Reservas e pagamentos</h2>
        <p>
          As reservas são processadas em nome das viações parceiras. Os preços exibidos
          são definidos pelas empresas de transporte. A RotaVIX se reserva o direito de
          cancelar reservas em caso de inconsistência nos dados.
        </p>

        <h2>5. Cancelamentos e reembolsos</h2>
        <p>
          As políticas de cancelamento e reembolso seguem as regras de cada viação parceira.
          Consulte os termos específicos no momento da compra.
        </p>

        <h2>6. Limitação de responsabilidade</h2>
        <p>
          A RotaVIX não se responsabiliza por atrasos, cancelamentos ou quaisquer problemas
          operacionais dos serviços prestados pelas viações parceiras.
        </p>

        <h2>7. Contato</h2>
        <p>
          Dúvidas sobre estes termos? Entre em contato pelo e-mail
          <a href="mailto:contato@rotavix.com.br">contato&#64;rotavix.com.br</a>.
        </p>
      </div>
    </section>
  `,
})
export class TermosComponent {}
