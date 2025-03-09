import { Component, OnInit } from '@angular/core';
import { product } from '../data.types';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true, // ✅ Torna o componente standalone
  imports: [CommonModule],
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: product[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Carregar o carrinho (verificando se localStorage está disponível)
  loadCart(): void {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      try {
        this.cartItems = this.cartService.getCart(); // Obter os itens do carrinho
      } catch (error) {
        console.warn('Erro ao carregar os itens do carrinho:', error);
        this.cartItems = []; // Retorna um carrinho vazio se ocorrer erro
      }
    } else {
      console.warn('localStorage não disponível no servidor.');
      this.cartItems = []; // Carrinho vazio se localStorage não estiver disponível
    }
  }

  // Remover item do carrinho
  removeItem(productId: number): void {
    try {
      this.cartService.removeFromCart(productId); // Remove o item
      this.loadCart(); // Atualiza o carrinho após remoção
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
    }
  }

  // Atualizar a quantidade de um item no carrinho
  updateQuantity(productId: number, event: any): void {
    const newQuantity = Number(event.target.value); // Converte para número
    if (newQuantity > 0) {
      try {
        this.cartService.updateQuantity(productId, newQuantity); // Passa a quantidade convertida
        this.loadCart(); // Atualiza o carrinho após alteração de quantidade
      } catch (error) {
        console.error('Erro ao atualizar a quantidade do item:', error);
      }
    }
  }

  // Limpar o carrinho
  clearCart(): void {
    try {
      this.cartService.clearCart(); // Limpa o carrinho
      this.loadCart(); // Atualiza o carrinho após limpeza
    } catch (error) {
      console.error('Erro ao limpar o carrinho:', error);
    }
  }

  // Cálculo da quantidade total de itens
  get totalQuantity(): number {
    return this.cartItems.reduce(
      (acc, item) => acc + (Number(item.quantity) || 0),
      0
    );
  }

  // Cálculo do valor total do carrinho
  get totalValue(): number {
    return this.cartItems.reduce(
      (acc, item) =>
        acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
  }

  // Finalizar compra (exemplo de método fictício)
  finalizePurchase(): void {
    alert('Compra finalizada com sucesso!');
    // Adicionar lógica para redirecionamento ou integração com API
  }
}
