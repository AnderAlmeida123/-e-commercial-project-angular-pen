import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { product } from '../data.types';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service'; // Importando o CartService
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NgbCarouselModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Corrigido para styleUrls
})
export class HomeComponent implements OnInit {
  popularProducts: product[] = [];
  allProducts: product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService // Injeta o CartService
  ) {}

  ngOnInit(): void {
    console.log('Componente [home.component] inicializado.');

    // Carregar os produtos
    this.productService.popularProducts().subscribe((data) => {
      this.allProducts = data; // Todos os produtos da API
      this.popularProducts = data.slice(0, 5); // Apenas os 5 primeiros para o carrossel
    });
  }

  // Método para adicionar o produto ao carrinho
  addToCart(product: product): void {
    this.cartService.addToCart(product); // Adiciona o produto ao carrinho
    alert('Produto adicionado ao carrinho!'); // Alerta de confirmação
  }
}
