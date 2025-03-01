import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { product } from '../data.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  addProduct(data: product) {
    return this.http.post(`http://localhost:3000/products`, data);
  }

  productList() {
    return this.http.get<product[]>(`http://localhost:3000/products`);
  }

  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  updateProduct(product: product) {
    return this.http.put<product>(
      `http://localhost:3000/products/${product.id}`,
      product
    );
  }

  popularProducts() {
    return this.http.get<product[]>(`http://localhost:3000/products`);
  }

  searchProducts(query: string): Observable<product[]> {
    return this.http.get<product[]>(
      `http://localhost:3000/products?name_like=${query}`
    );
  }
}
