import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { login, signUp } from '../data.types';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.getUserFromStorage() !== null
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getUserFromStorage() {
    try {
      if (
        typeof window !== 'undefined' &&
        typeof window.localStorage !== 'undefined'
      ) {
        return JSON.parse(localStorage.getItem('user') || 'null');
      }
      return null; // Se não estiver no navegador, retorna null
    } catch (error) {
      console.warn('Erro ao recuperar usuário do localStorage:', error);
      return null;
    }
  }

  userSignup(user: signUp) {
    if (!user.name || !user.email || !user.password) {
      console.warn('Dados inválidos no cadastro.');
      return;
    }

    console.log('Registrando usuário:', user);

    this.http
      .post<signUp>(this.apiUrl, user, { observe: 'response' })
      .subscribe({
        next: (result) => {
          if (result && result.body) {
            const { password, ...userWithoutPassword } = result.body;
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            }
            this.isLoggedInSubject.next(true);
            this.router.navigate(['/']);
          } else {
            console.warn('Erro: resposta de cadastro sem corpo válido.');
          }
        },
        error: (error) => {
          console.error('Erro ao cadastrar usuário:', error);
        },
      });
  }

  userLogin(data: login) {
    if (!data.email || !data.password) {
      console.warn('Email ou senha não podem estar vazios.');
      return;
    }

    console.log('Tentando login com:', data.email);

    this.http
      .get<signUp[]>(`${this.apiUrl}?email=${data.email}`, {
        observe: 'response',
      })
      .subscribe({
        next: (result) => {
          if (result.body && result.body.length > 0) {
            const user = result.body.find((u) => u.password === data.password);

            if (!user) {
              console.warn('Senha incorreta.');
              return;
            }

            const { password, ...userWithoutPassword } = user;
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            }
            this.isLoggedInSubject.next(true);
            this.router.navigate(['/']);
          } else {
            console.warn('Usuário não encontrado.');
          }
        },
        error: (error) => {
          console.error('Erro ao fazer login:', error);
        },
      });
  }

  logout() {
    console.log('Realizando logout...');
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
    }
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/user-auth']);
  }
}
