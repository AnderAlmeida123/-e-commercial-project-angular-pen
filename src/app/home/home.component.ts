import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { product } from '../data.types';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NgbCarouselModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  popularProducts: product[] = [];
  allProducts: product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.popularProducts().subscribe((data) => {
      this.allProducts = data; // 🔹 Todos os produtos da API
      this.popularProducts = data.slice(0, 5); // 🔹 Apenas os 5 primeiros para o carrossel
    });
  }
}
