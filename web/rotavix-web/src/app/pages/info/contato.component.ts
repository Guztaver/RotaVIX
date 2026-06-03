import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  styleUrl: './info-shared.scss',
  template: `
    <section class="info-page container">
      <a routerLink="/" class="info-page__back">← Voltar</a>
      <h1 class="info-page__title">Contato</h1>
      <div class="info-page__content">
        <p>Fale com a gente! Preencha o formulário abaixo e responderemos em até 24 horas.</p>

        @if (sent()) {
          <div class="info-page__success">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h2>Mensagem enviada!</h2>
            <p>Obrigado pelo contato. Retornaremos em breve.</p>
          </div>
        } @else {
          <form [formGroup]="contactForm" (ngSubmit)="submit()" class="info-page__form">
            <div class="info-page__form-row">
              <div class="form-group">
                <label class="form-label" for="contact-name">Nome</label>
                <input id="contact-name" type="text" class="form-input" formControlName="name" placeholder="Seu nome" />
              </div>
              <div class="form-group">
                <label class="form-label" for="contact-email">E-mail</label>
                <input id="contact-email" type="email" class="form-input" formControlName="email" placeholder="seu@email.com" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="contact-subject">Assunto</label>
              <input id="contact-subject" type="text" class="form-input" formControlName="subject" placeholder="Assunto da mensagem" />
            </div>
            <div class="form-group">
              <label class="form-label" for="contact-message">Mensagem</label>
              <textarea id="contact-message" class="form-input" formControlName="message" rows="5" placeholder="Escreva sua mensagem..." style="resize: vertical"></textarea>
            </div>
            <button type="submit" class="btn btn-accent" [disabled]="contactForm.invalid">Enviar mensagem</button>
          </form>
        }
      </div>
    </section>
  `,
})
export class ContatoComponent {
  readonly sent = signal(false);

  readonly contactForm = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit(): void {
    if (this.contactForm.invalid) return;
    // Simulate sending (no actual backend for contact form)
    this.sent.set(true);
  }
}
