import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly isHomePage = signal(true);

  constructor(router: Router) {
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      this.isHomePage.set((e as NavigationEnd).urlAfterRedirects === '/');
    });
  }
}
