import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data.types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.css',
})
export class SellerAddProductComponent implements OnInit {
  addProductMessage: string | undefined;
  constructor(private product: ProductService) {}
  ngOnInit(): void {}

  submit(data: product) {
    this.product.addProduct(data).subscribe((result) => {
      if (result) {
        this.addProductMessage = 'Produto Cadastrado com Sucesso';
      }
      setTimeout(() => (this.addProductMessage = undefined), 3000);
    });
  }
}
