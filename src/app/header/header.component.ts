import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  menuType: string = 'default'; // Tipo de menu, visitante ou vendedor
  sellerName: string = ''; // Nome do vendedor
  searchTerm: string = ''; // Termo de pesquisa
  searchResult: product[] = []; // Inicializa como array vazio

  constructor(
    private route: Router,
    private productService: ProductService // Serviço de produtos
  ) {}

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        this.updateMenuType(val.url); // Atualiza o tipo de menu com base na URL
      }
    });
    this.checkSellerStatus(); // Verifica o status do vendedor ao inicializar
  }

  // Função para verificar e atualizar o estado do vendedor
  checkSellerStatus(): void {
    if (typeof window !== 'undefined' && localStorage.getItem('seller')) {
      let sellerStore = localStorage.getItem('seller');
      if (sellerStore) {
        let sellerData = JSON.parse(sellerStore);
        if (Array.isArray(sellerData) && sellerData.length > 0) {
          this.sellerName = sellerData[0].name;
        } else {
          this.sellerName = '';
        }
      }
    }
  }

  // Atualiza o tipo de menu (visitante ou vendedor) com base na URL
  updateMenuType(url: string): void {
    if (url.includes('seller')) {
      this.menuType = 'seller';
    } else {
      this.menuType = 'default';
    }
  }

  // Função de logout
  logout(): void {
    localStorage.removeItem('seller'); // Remove as informações do vendedor
    this.sellerName = ''; // Limpa o nome do vendedor
    this.route.navigate(['/']); // Redireciona para a página inicial
  }

  // Função de pesquisa
  searchProducts(query: string): void {
    if (query) {
      this.productService.searchProducts(query).subscribe((result) => {
        console.log('🔍 Resultados da pesquisa:', result);
        this.searchResult = result.slice(0, 5); // Limita a 5 itens para exibição
      });
    } else {
      this.searchResult = []; // Limpa os resultados se não houver consulta
    }
  }

  // Função para esconder os resultados de pesquisa quando o campo perder o foco
  hideSearch(): void {
    this.searchResult = []; // Limpa os resultados ao perder o foco
  }

  // Envia a pesquisa e navega para a página de resultados
  submitSearch(val: string): void {
    if (val) {
      this.route.navigate([`search/${val}`]); // Navega para a página de busca com o termo
    }
  }

  onSearchChange(query: string): void {
    if (query) {
      this.productService.searchProducts(query).subscribe((result) => {
        console.log('🔍 Resultados da pesquisa:', result);
        this.searchResult = result.slice(0, 5); // Limita a 5 itens
      });
    } else {
      this.searchResult = []; // Limpa os resultados se não houver consulta
    }
  }
}
