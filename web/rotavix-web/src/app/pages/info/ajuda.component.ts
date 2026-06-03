import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FaqItem {
  q: string;
  a: string;
  open: boolean;
}

@Component({
  standalone: true,
  imports: [RouterLink],
  styleUrl: './info-shared.scss',
  template: `
    <section class="info-page container">
      <a routerLink="/" class="info-page__back">← Voltar</a>
      <h1 class="info-page__title">Ajuda</h1>
      <div class="info-page__content">
        <p>Encontre respostas para as dúvidas mais comuns sobre a RotaVIX.</p>

        <div class="info-page__faq">
          @for (item of faq(); track item.q) {
            <div class="info-page__faq-item" [class.info-page__faq-item--open]="item.open">
              <button class="info-page__faq-question" (click)="toggle(item)">
                <span>{{ item.q }}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              @if (item.open) {
                <div class="info-page__faq-answer">{{ item.a }}</div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class AjudaComponent {
  readonly faq = signal<FaqItem[]>([
    {
      q: 'Como faço para comprar uma passagem?',
      a: 'Na página inicial, informe a cidade de origem, destino e a data da viagem. Clique em "Buscar" para ver as rotas disponíveis. Escolha a rota desejada, selecione o assento, preencha seus dados e finalize a reserva.',
      open: false,
    },
    {
      q: 'Preciso criar uma conta?',
      a: 'Não é obrigatório. Você pode comprar passagens sem se identificar. No entanto, ao criar um nome de usuário, você consegue visualizar todo seu histórico de reservas em um só lugar.',
      open: false,
    },
    {
      q: 'Quais formas de pagamento são aceitas?',
      a: 'Atualmente aceitamos Pix, cartão de crédito e boleto bancário. O pagamento é processado diretamente pela viação parceira.',
      open: false,
    },
    {
      q: 'Posso cancelar uma reserva?',
      a: 'Sim. A política de cancelamento segue as regras de cada viação. Verifique os termos específicos no momento da compra. Para solicitar um cancelamento, entre em contato conosco.',
      open: false,
    },
    {
      q: 'Como escolher meu assento?',
      a: 'Durante a reserva, você verá um mapa visual do ônibus. Basta clicar no número do assento desejado. Assentos já ocupados não aparecerão disponíveis.',
      open: false,
    },
    {
      q: 'Meus dados estão seguros?',
      a: 'Sim. Seguimos a LGPD e utilizamos seus dados apenas para processar sua reserva. Consulte nossa Política de Privacidade para mais detalhes.',
      open: false,
    },
    {
      q: 'Como entro em contato com o suporte?',
      a: 'Acesse a página de Contato pelo menu inferior do site e preencha o formulário. Respondemos em até 24 horas.',
      open: false,
    },
  ]);

  toggle(item: FaqItem): void {
    item.open = !item.open;
  }
}
