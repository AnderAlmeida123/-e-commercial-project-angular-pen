import { Injectable } from '@angular/core';
import { login, signUp } from '../data.types';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'; // 🔹 Importar BehaviorSubject

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkUserLoggedIn();
  }

  private checkUserLoggedIn() {
    const user = localStorage.getItem('user');
    this.isLoggedInSubject.next(!!user);
  }

  userSignup(user: signUp) {
    console.log('[UserService] Iniciando userSignup()', user);
    this.http
      .post('http://localhost:3000/users', user, { observe: 'response' })
      .subscribe((result) => {
        if (result && result.body) {
          const { password, ...userWithoutPassword } = result.body as signUp;
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          this.isLoggedInSubject.next(true); // 🔹 Notifica que o usuário está logado
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
      .subscribe((result) => {
        if (result && result.body && result.body.length > 0) {
          const user = result.body[0];
          const { password, ...userWithoutPassword } = user;
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          this.isLoggedInSubject.next(true); // 🔹 Notifica que o usuário está logado
          this.router.navigate(['/']);
        } else {
          console.log('[UserService] Usuário ou senha inválidos');
        }
      });
  }

  logout() {
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false); // 🔹 Notifica que o usuário saiu
    this.router.navigate(['/']);
  }
}
