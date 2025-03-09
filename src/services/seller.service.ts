// Importações necessárias para criar o serviço
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Cliente HTTP para fazer requisições à API
import { login, SignUp } from '../app/data.types'; // Importação das interfaces para tipagem dos dados
import { BehaviorSubject } from 'rxjs'; // BehaviorSubject para gerenciar o estado de login
import { Router } from '@angular/router'; // Router para navegação entre páginas

@Injectable({
  providedIn: 'root', // Define que esse serviço pode ser injetado em qualquer parte da aplicação
})
export class SellerService {
  // Criando observáveis para acompanhar o estado do login do vendedor
  isSellerLoggedIn = new BehaviorSubject<boolean>(this.hasSellerInStorage()); // Estado de login do vendedor
  isLoginError = new BehaviorSubject<boolean>(false); // Estado de erro no login

  constructor(private http: HttpClient, private router: Router) {}

  // Método para cadastrar um novo vendedor
  userSignUp(data: SignUp) {
    this.http
      .post(
        'https://my-json-server.typicode.com/AnderAlmeida123/repository-eCommerce/seller',
        data,
        { observe: 'response' }
      ) // Faz uma requisição POST para a API simulada
      .subscribe({
        next: (result) => {
          this.isSellerLoggedIn.next(true); // Atualiza o estado para "logado"
          localStorage.setItem('seller', JSON.stringify(result.body)); // Salva os dados do vendedor no localStorage
          this.router.navigate(['seller-home']); // Redireciona para a página do vendedor
          console.warn('Cadastro realizado com sucesso:', result);
        },
        error: (error) => {
          // Tratamento de erro em caso de falha no cadastro
          console.error('Erro ao cadastrar:', error);
          alert(
            'Falha no cadastro. Tente novamente mais tarde ou entre em contato com o suporte.'
          );
        },
      });
  }

  // Método para verificar se o vendedor já está logado ao recarregar a página
  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true); // Atualiza o estado de login para "true"
      this.router.navigate(['seller-home']); // Redireciona para a página do vendedor
    }
  }

  // Método privado que verifica se há um vendedor salvo no localStorage
  private hasSellerInStorage(): boolean {
    return (
      typeof window !== 'undefined' && localStorage.getItem('seller') !== null
    );
  }

  // Método para verificar se o vendedor está autenticado
  isAuthenticated(): boolean {
    return this.isSellerLoggedIn.getValue(); // Retorna o estado atual do login
  }

  // Método para realizar login do vendedor
  userLogin(data: login) {
    console.warn(data);
    this.http
      .get(
        `https://my-json-server.typicode.com/AnderAlmeida123/repository-eCommerce/seller?email=${data.email}&password=${data.password}`,
        { observe: 'response' } // Faz uma requisição GET para buscar o vendedor pelo email e senha
      )
      .subscribe((result: any) => {
        console.warn(result);
        if (result && result.body && result.body.length === 1) {
          this.isLoginError.next(false); // Define que não há erro de login
          localStorage.setItem('seller', JSON.stringify(result.body)); // Salva os dados do vendedor no localStorage
          this.router.navigate(['seller-home']); // Redireciona para a página do vendedor
        } else {
          console.warn('Não foi possível acessar o sistema');
          this.isLoginError.next(true); // Atualiza o estado para indicar erro no login
        }
      });
  }

  //metodo para deslogar da pagina.
  logout() {
    localStorage.removeItem('seller'); // Remove os dados do usuário do localStorage
    this.isSellerLoggedIn.next(false); // Atualiza o estado de login para "false"
    this.router.navigate(['/']); // Redireciona para a página inicial ou de login
  }
}

/*
🔎 O que esse código faz?
Gerencia o estado do login do vendedor usando BehaviorSubject (isSellerLoggedIn e isLoginError).
Realiza operações de autenticação:
Cadastro (userSignUp) → Envia os dados do vendedor para o servidor.
Login (userLogin) → Verifica se o email e senha correspondem a um usuário no banco de dados.
Verificação automática (reloadSeller) → Mantém o usuário logado após recarregar a página.
Utiliza localStorage para armazenar os dados do vendedor, permitindo que a autenticação persista.
Redireciona o usuário para a página correta após o login/cadastro.

*/
