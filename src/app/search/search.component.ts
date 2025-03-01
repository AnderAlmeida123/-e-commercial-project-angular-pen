import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../data.types'; // Certifique-se de que o tipo 'Product' está correto
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchResult: product[] | undefined;
  searchQuery: string = ''; // Para armazenar o termo de pesquisa

  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    let query = this.activeRoute.snapshot.paramMap.get('query');
    if (query) {
      this.searchQuery = query;
      this.searchProducts(query); // Realiza a pesquisa ao carregar
    }
  }

  // Função chamada ao realizar a pesquisa
  searchProducts(query: string): void {
    this.productService.searchProducts(query).subscribe(
      (result) => {
        // Filtra pelos campos de cada item, como 'name', 'description', 'price', etc.
        this.searchResult = result.filter(
          (item) => this.searchInProduct(item, query) // Verifica se o termo de pesquisa aparece em qualquer campo
        );
        console.log('🔍 Produtos filtrados:', this.searchResult);
      },
      (error) => {
        console.error('Erro ao buscar produtos:', error); // Tratamento de erro
      }
    );
  }

  // Função que verifica se o termo de pesquisa existe em qualquer campo do produto
  searchInProduct(product: product, query: string): boolean {
    // Converte o termo de pesquisa para minúsculas e verifica se o valor existe em algum campo
    return (
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.price.toString().toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase()) || // Verifica a descrição, se existir
      // Adicione outros campos aqui, conforme necessário
      false // Caso o valor não esteja presente em nenhum campo
    );
  }

  // Função chamada quando o usuário digita na barra de pesquisa
  onSearchChange(): void {
    if (this.searchQuery) {
      this.searchProducts(this.searchQuery); // Pesquisa enquanto digita (não obrigatório)
    }
  }
}
