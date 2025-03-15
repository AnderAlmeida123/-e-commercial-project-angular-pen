import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SellerService } from '../services/seller.service';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'loja-projeto';

  constructor(private seller: SellerService, private router: Router) {
    console.log('Inicializando o componente e o roteador...');

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Rota mudada, rolando para o topo...');
        window.scrollTo(0, 0); // Faz a página rolar para o topo ao mudar de rota
      }
    });
  }
}
