import { Injectable, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { product } from '../data.types';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnInit {
  private cartKey = 'cartItems';
  private cartItemsSubject = new BehaviorSubject<product[]>(this.getCart()); // ✅ Inicializa com os itens do localStorage
  cartItems$ = this.cartItemsSubject.asObservable(); // ✅ Expor para os componentes se inscreverem

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  getCart(): product[] {
    if (isPlatformBrowser(this.platformId)) {
      const cartData = localStorage.getItem(this.cartKey);
      return cartData ? JSON.parse(cartData) : [];
    } else {
      return [];
    }
  }

  addToCart(product: product): void {
    let cartItems = this.cartItemsSubject.value;
    let existingProduct = cartItems.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity ?? 0) + 1;
    } else {
      product.quantity = 1;
      cartItems = [...cartItems, product];
    }

    this.cartItemsSubject.next(cartItems); // Atualiza o estado reativo
    localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
  }

  removeFromCart(productId: number): void {
    let cartItems = this.getCart().filter((item) => item.id !== productId);
    this.saveCart(cartItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    let cartItems = this.getCart().map((item) => {
      if (item.id === productId) item.quantity = quantity;
      return item;
    });

    this.saveCart(cartItems);
  }

  clearCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.cartKey);
      this.cartItemsSubject.next([]); // ✅ Atualiza a lista de itens
    }
  }

  private saveCart(cartItems: product[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
      this.cartItemsSubject.next(cartItems); // ✅ Atualiza o BehaviorSubject
    }
  }
}
