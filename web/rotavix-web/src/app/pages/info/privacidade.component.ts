import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  styleUrl: './info-shared.scss',
  template: `
    <section class="info-page container">
      <a routerLink="/" class="info-page__back">← Voltar</a>
      <h1 class="info-page__title">Política de privacidade</h1>
      <div class="info-page__content">
        <p><strong>Última atualização:</strong> 01/06/2026</p>

        <h2>1. Introdução</h2>
        <p>
          A RotaVIX leva a sua privacidade a sério. Esta política explica como coletamos,
          usamos e protegemos suas informações pessoais, em conformidade com a
          <strong>Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)</strong>.
        </p>

        <h2>2. Dados coletados</h2>
        <p>Podemos coletar as seguintes informações:</p>
        <ul>
          <li><strong>Nome de usuário</strong> — para identificar suas reservas.</li>
          <li><strong>Dados da reserva</strong> — nome do passageiro, documento, assento escolhido.</li>
          <li><strong>Cookies essenciais</strong> — para manter sua sessão e preferências.</li>
        </ul>
        <p>Não coletamos dados de pagamento — estes são processados diretamente pelas viações parceiras.</p>

        <h2>3. Finalidade do tratamento</h2>
        <p>Seus dados são utilizados exclusivamente para:</p>
        <ul>
          <li>Processar e confirmar suas reservas de passagens.</li>
          <li>Exibir seu histórico de reservas.</li>
          <li>Melhorar a experiência de uso da plataforma.</li>
        </ul>

        <h2>4. Compartilhamento de dados</h2>
        <p>
          Seus dados são compartilhados apenas com a viação parceira responsável pela rota
          que você selecionou, exclusivamente para fins de emissão da passagem.
          Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.
        </p>

        <h2>5. Cookies</h2>
        <p>
          Utilizamos apenas cookies essenciais para o funcionamento da plataforma, como
          armazenar seu nome de usuário (mediante consentimento). Não utilizamos cookies
          de rastreamento ou publicidade.
        </p>
        <p>
          Você pode gerenciar suas preferências de cookies a qualquer momento através do
          banner de consentimento exibido na parte inferior da página.
        </p>

        <h2>6. Seus direitos (LGPD)</h2>
        <p>Você tem direito a:</p>
        <ul>
          <li>Confirmar a existência de tratamento dos seus dados.</li>
          <li>Acessar seus dados armazenados.</li>
          <li>Corrigir dados incompletos ou desatualizados.</li>
          <li>Solicitar a exclusão dos seus dados.</li>
          <li>Revogar o consentimento a qualquer momento.</li>
        </ul>

        <h2>7. Contato do DPO</h2>
        <p>
          Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em
          contato com nosso Encarregado de Dados:
          <a href="mailto:privacidade@rotavix.com.br">privacidade&#64;rotavix.com.br</a>.
        </p>
      </div>
    </section>
  `,
})
export class PrivacidadeComponent {}
