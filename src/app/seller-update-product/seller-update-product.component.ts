import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data.types';

@Component({
  selector: 'app-seller-update-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './seller-update-product.component.html',
  styleUrl: './seller-update-product.component.css',
})
export class SellerUpdateProductComponent implements OnInit {
  productData: undefined | product;
  productMessage: undefined | string;

  constructor(
    private route: ActivatedRoute,
    private product: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let productId = this.route.snapshot.paramMap.get('id');
    productId &&
      this.product.getProduct(productId).subscribe((data) => {
        this.productData = data;
      });
  }

  submit(data: product): void {
    if (this.productData) {
      data.id = this.productData.id;
    }
    this.product.updateProduct(data).subscribe((result) => {
      if (result) {
        this.productMessage = 'Produto Atualizado com Sucesso';
      }
    });
    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);
  }
}
