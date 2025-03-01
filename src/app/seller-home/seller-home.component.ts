import { Component, OnInit } from '@angular/core';
import { product } from '../data.types';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './seller-home.component.html',
  styleUrl: './seller-home.component.css',
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | product[];
  productMessage: undefined | string;

  faTrash = faTrash;
  faEdit = faEdit;

  constructor(private product: ProductService) {}

  ngOnInit(): void {
    this.list();
  }
  deleteProduct(id: number) {
    this.product.deleteProduct(id).subscribe((result) => {
      if (result) {
        this.productMessage = 'Produto deletado com Sucesso';
        this.list();
      }
    });
    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);
  }

  list() {
    this.product.productList().subscribe((result) => {
      if (result) {
        this.productList = result;
      }
    });
  }
}
