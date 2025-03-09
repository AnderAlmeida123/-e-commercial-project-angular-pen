import { Injectable } from '@angular/core';
import { login, signUp } from '../data.types';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkUserLoggedIn(); // Verifica se o usuário está logado ao inicializar
  }

  private checkUserLoggedIn() {
    const user = localStorage.getItem('user');
    this.isLoggedInSubject.next(!!user); // Se houver usuário no localStorage, o usuário está logado
  }

  userSignup(user: signUp) {
    this.http
      .post('http://localhost:3000/users', user, { observe: 'response' })
      .subscribe((result) => {
        if (result && result.body) {
          const { password, ...userWithoutPassword } = result.body as signUp;
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          this.isLoggedInSubject.next(true); // Atualiza o estado de login
          this.router.navigate(['/']);
        }
      });
  }

  userLogin(data: login) {
    this.http
      .get<signUp[]>(
        `http://localhost:3000/users?email=${data.email}&password=${data.password}`,
        { observe: 'response' }
      )
      .subscribe({
        next: (result) => {
          console.log('Resposta recebida:', result);
          if (result && result.body && result.body.length > 0) {
            const user = result.body[0];
            const { password, ...userWithoutPassword } = user;
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            this.isLoggedInSubject.next(true); // Atualiza o estado de login
            this.router.navigate(['/']);
          } else {
            console.log('Usuário ou senha inválidos');
          }
        },
        error: (error) => {
          console.log('Erro ao realizar requisição', error);
        },
      });
  }

  logout() {
    localStorage.removeItem('user'); // Remove o usuário do localStorage
    this.isLoggedInSubject.next(false); // Atualiza o estado de login
    this.router.navigate(['/']); // Redireciona para a página inicial
  }
}
