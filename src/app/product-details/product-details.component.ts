import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../data.types';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product;
  productQuantity: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private product: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    let productId = this.activatedRoute.snapshot.paramMap.get('productId');
    if (productId) {
      this.product.getProduct(productId).subscribe((result) => {
        this.productData = result;
      });
    }
  }

  handleQuantity(val: string) {
    if (val === 'plus' && this.productQuantity < 20) {
      this.productQuantity++;
    } else if (val === 'min' && this.productQuantity > 1) {
      this.productQuantity--;
    }
  }

  addToCart() {
    if (this.productData) {
      this.cartService.addToCart(this.productData); // Utilize o CartService aqui
      alert('Produto adicionado ao carrinho!');
    }
  }
}
