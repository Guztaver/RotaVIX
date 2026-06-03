import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  styleUrl: './info-shared.scss',
  template: `
    <section class="info-page container">
      <a routerLink="/" class="info-page__back">← Voltar</a>
      <h1 class="info-page__title">Sobre nós</h1>
      <div class="info-page__content">
        <p>
          A <strong>RotaVIX</strong> nasceu com a missão de simplificar a compra de
          passagens rodoviárias no Brasil. Conectamos passageiros às melhores viações do país
          com transparência, agilidade e o melhor preço.
        </p>
        <h2>Nossa história</h2>
        <p>
          Fundada em 2024, a RotaVIX surgiu da necessidade de modernizar o setor de transporte
          rodoviário. Identificamos que milhões de brasileiros ainda enfrentam dificuldades para
          comparar preços, horários e serviços entre diferentes empresas de ônibus.
        </p>
        <p>
          Desde então, já conectamos milhares de passageiros a centenas de destinos por todo o
          Brasil, sempre priorizando a experiência do usuário e a confiabilidade das informações.
        </p>
        <h2>Missão</h2>
        <p>
          Democratizar o acesso ao transporte rodoviário, oferecendo uma plataforma completa
          onde qualquer pessoa possa encontrar, comparar e reservar passagens de ônibus de
          forma rápida, segura e econômica.
        </p>
        <h2>Valores</h2>
        <ul>
          <li><strong>Transparência</strong> — Preços claros, sem taxas escondidas.</li>
          <li><strong>Confiança</strong> — Parceria apenas com viações verificadas.</li>
          <li><strong>Inovação</strong> — Tecnologia a serviço da melhor experiência.</li>
          <li><strong>Acessibilidade</strong> — Plataforma simples para todos os públicos.</li>
        </ul>
      </div>
    </section>
  `,
})
export class SobreComponent {}
