import { Injectable, signal } from '@angular/core';

const COOKIE_CONSENT_KEY = 'rotavix_cookie_consent';
const USERNAME_KEY = 'rotavix_username';
const COOKIE_MAX_AGE_DAYS = 365;

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Whether cookies consent was given */
  readonly consentGranted = signal(this.hasConsent());

  /** Current logged-in username (null = not logged in) */
  readonly username = signal(this.getStoredUsername());

  /* ------------------------------------------------------------------ */
  /* Cookie helpers                                                     */
  /* ------------------------------------------------------------------ */

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not widely supported yet
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  }

  private deleteCookie(name: string): void {
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not widely supported yet
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  /* ------------------------------------------------------------------ */
  /* Consent                                                            */
  /* ------------------------------------------------------------------ */

  hasConsent(): boolean {
    return this.getCookie(COOKIE_CONSENT_KEY) === 'true';
  }

  grantConsent(): void {
    this.setCookie(COOKIE_CONSENT_KEY, 'true', COOKIE_MAX_AGE_DAYS);
    this.consentGranted.set(true);
  }

  revokeConsent(): void {
    this.deleteCookie(COOKIE_CONSENT_KEY);
    this.deleteCookie(USERNAME_KEY);
    this.consentGranted.set(false);
    this.username.set(null);
  }

  /* ------------------------------------------------------------------ */
  /* Username                                                           */
  /* ------------------------------------------------------------------ */

  getStoredUsername(): string | null {
    if (!this.hasConsent()) {
      return null;
    }
    return this.getCookie(USERNAME_KEY);
  }

  /**
   * Login — stores username in a cookie (requires consent).
   * Returns false if consent hasn't been given yet.
   */
  login(name: string): boolean {
    if (!this.hasConsent()) {
      return false;
    }
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      return false;
    }
    this.setCookie(USERNAME_KEY, trimmed, COOKIE_MAX_AGE_DAYS);
    this.username.set(trimmed);
    return true;
  }

  logout(): void {
    this.deleteCookie(USERNAME_KEY);
    this.username.set(null);
  }
}
