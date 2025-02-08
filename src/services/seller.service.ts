import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { login, SignUp } from '../app/data.types';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(this.hasSellerInStorage());
  isLoginError = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {}

  userSignUp(data: SignUp) {
    this.http
      .post('http://localhost:3000/seller', data, { observe: 'response' }) // Envia uma requisição POST para a API
      .subscribe({
        next: (result) => {
          this.isSellerLoggedIn.next(true);
          localStorage.setItem('seller', JSON.stringify(result.body));
          this.router.navigate(['seller-home']); // Redireciona para a página do vendedor
          console.warn('Cadastro realizado com sucesso:', result);
        },
        error: (error) => {
          // Tratamento mais robusto de erro
          console.error('Erro ao cadastrar:', error);
          alert(
            'Falha no cadastro. Tente novamente mais tarde ou entre em contato com o suporte.'
          );
        },
      });
  }

  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }
  private hasSellerInStorage(): boolean {
    return (
      typeof window !== 'undefined' && localStorage.getItem('seller') !== null
    );
  }

  isAuthenticated(): boolean {
    return this.isSellerLoggedIn.getValue();
  }

  userLogin(data: login) {
    console.warn(data);
    this.http
      .get(
        `http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
        { observe: 'response' } // Envia uma requisição POST para a API
      )
      .subscribe((result: any) => {
        console.warn(result);
        if (result && result.body && result.body.length === 1) {
          this.isLoginError.next(false);
          localStorage.setItem('seller', JSON.stringify(result.body));
          this.router.navigate(['seller-home']); // Redireciona para a página do vendedor
        } else {
          console.warn('Não foi possivel acessar o sistema');
          this.isLoginError.next(true);
        }
      });
  }
}
