import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { product } from '../data.types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default'; // Tipo de menu (padrão ou vendedor)
  sellerName: string = ''; // Nome do vendedor logado
  userName: string = ''; // Nome do usuário logado
  searchTerm: string = ''; // Termo de pesquisa
  searchResult: product[] = []; // Lista de sugestões de pesquisa

  constructor(
    private route: Router,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef // Injeta o serviço de detecção de mudanças
  ) {}

  ngOnInit(): void {
    // Monitora mudanças na rota para definir o menu correto
    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateMenuType(event.url);
        this.checkLoginStatus(); // Garante que o login seja checado sempre que a rota mudar
      }
    });

    this.checkLoginStatus(); // Verifica se há um usuário ou vendedor logado
  }

  // Verifica se o usuário ou vendedor está logado
  checkLoginStatus(): void {
    if (typeof window !== 'undefined') {
      const sellerStore = localStorage.getItem('seller');
      const userStore = localStorage.getItem('user');

      if (sellerStore) {
        let sellerData = JSON.parse(sellerStore);
        this.sellerName =
          Array.isArray(sellerData) && sellerData.length > 0
            ? sellerData[0].name
            : '';
      } else {
        this.sellerName = '';
      }

      if (userStore) {
        let userData = JSON.parse(userStore);
        this.userName = userData.name || '';
      } else {
        this.userName = '';
      }

      this.cdRef.detectChanges(); // Força a atualização do UI imediatamente
    }
  }

  // Define o menu com base na URL
  updateMenuType(url: string): void {
    this.menuType = url.includes('seller') ? 'seller' : 'default';
  }

  // Realiza login do usuário
  login(user: any): void {
    // Supondo que você tenha um serviço que faz login e retorna as informações do usuário
    localStorage.setItem('user', JSON.stringify(user)); // Salva as informações do usuário no localStorage
    this.userName = user.name; // Atualiza o nome do usuário
    this.checkLoginStatus(); // Atualiza o status do login
    this.route.navigate(['/']); // Redireciona para a home após o login

    setTimeout(() => {
      this.cdRef.detectChanges(); // Força a atualização do template para refletir a mudança
    }, 100); // Pequeno delay para garantir que a navegação tenha ocorrido
  }

  // Realiza logout do usuário ou vendedor
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('seller');
    this.userName = '';
    this.sellerName = '';
    this.menuType = 'default'; // Reseta o menu para o estado de visitante
    this.route.navigate(['/']); // Redireciona para a página inicial

    this.cdRef.detectChanges(); // Força a atualização do template para refletir a mudança
  }

  // Função de pesquisa de produtos
  searchProducts(query: string): void {
    if (query.trim()) {
      this.productService.searchProducts(query).subscribe((result) => {
        this.searchResult = result.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
      });
    } else {
      this.searchResult = [];
    }
  }

  // Esconde a lista de pesquisa ao perder o foco
  hideSearch(): void {
    setTimeout(() => {
      this.searchResult = [];
    }, 200);
  }

  // Realiza a pesquisa e redireciona para a página de resultados
  submitSearch(val: string): void {
    if (val) {
      this.route.navigate([`search/${val}`]);
      this.searchResult = [];
    }
  }

  // Redireciona para os detalhes do produto
  redirectToDetails(id: number) {
    this.searchResult = [];
    this.route.navigate(['/details/', id]);
  }
}
