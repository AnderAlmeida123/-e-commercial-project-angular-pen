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
    return this.http.post(
      `https://my-json-server.typicode.com/AnderAlmeida123/repository-eCommerce/products`,
      data
    );
  }

  productList() {
    return this.http.get<product[]>(
      `https://my-json-server.typicode.com/AnderAlmeida123/repository-eCommerce/products`
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(
      `https://my-json-server.typicode.com/AnderAlmeida123/repository-eCommerce/products/${id}`
    );
  }

  getProduct(id: string) {
    return this.http.get<product>(
      `https://my-json-server.typicode.com/AnderAlmeida123/repository-eCommerce/products/${id}`
    );
  }

  updateProduct(product: product) {
    return this.http.put<product>(
      `https://my-json-server.typicode.com/AnderAlmeida123/repository-eCommerce/products/${product.id}`,
      product
    );
  }

  popularProducts() {
    return this.http.get<product[]>(
      `https://my-json-server.typicode.com/AnderAlmeida123/repository-eCommerce/products`
    );
  }

  searchProducts(query: string): Observable<product[]> {
    return this.http.get<product[]>(
      `https://my-json-server.typicode.com/AnderAlmeida123/repository-eCommerce/products?name_like=${query}`
    );
  }
}
