import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as DOMPurify from 'dompurify';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css'],
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true;
  isLoggedIn: boolean = false;
  userName: string = '';
  showSignupPassword: boolean = false;
  showLoginPassword: boolean = false;

  signupForm!: FormGroup;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Componente [user-auth] inicializado.');
    this.initForms();
    this.loadUserInfo();

    this.userService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.updateUserName();
    });
  }

  togglePasswordVisibility(type: 'signup' | 'login'): void {
    if (type === 'signup') this.showSignupPassword = !this.showSignupPassword;
    if (type === 'login') this.showLoginPassword = !this.showLoginPassword;
  }

  private initForms(): void {
    this.signupForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
        ],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(8)],
      ],
    });

    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Função para verificar se estamos no ambiente de navegador
  isBrowser(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }

  private loadUserInfo(): void {
    console.log('Iniciando a carga de informações do usuário...');
    if (this.isBrowser()) {
      // Verifica se o ambiente é o navegador
      try {
        console.log('Tentando acessar sessionStorage...');
        const user = sessionStorage.getItem('user');
        console.log('Usuário recuperado do sessionStorage:', user);

        if (user) {
          const userData = JSON.parse(user);
          console.log('Dados do usuário:', userData);
          this.userName = userData.name || '';
          this.isLoggedIn = true;
          console.log('Usuário encontrado e carregado:', this.userName);
        } else {
          console.log('Nenhum usuário encontrado no sessionStorage.');
        }
      } catch (error) {
        console.warn('Erro ao acessar o sessionStorage:', error);
      }
    } else {
      console.log(
        'Não é possível acessar sessionStorage, ambiente não suportado.'
      );
    }
  }

  private updateUserName(): void {
    if (this.isBrowser()) {
      const user = sessionStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        this.userName = userData.name || '';
      }
    }
  }

  private sanitizeInput(value: string): string {
    return this.sanitize(value);
  }

  sanitize(value: string): string {
    if (this.isBrowser() && window.DOMParser) {
      const doc = new DOMParser().parseFromString(value, 'text/html');
      const sanitized = doc.body.textContent || ''; // A propriedade `textContent` retorna o texto sem tags HTML
      return sanitized;
    }
    return value; // Caso não esteja no navegador, retorna o valor original
  }

  signUp(): void {
    if (this.signupForm.valid) {
      let sanitizedData = {
        id: crypto.randomUUID(), // Gera um ID único
        name: this.sanitizeInput(this.signupForm.value.name),
        email: this.sanitizeInput(this.signupForm.value.email),
        password: this.signupForm.value.password,
      };

      console.log('Realizando cadastro:', sanitizedData);
      this.userService.userSignup(sanitizedData);
    } else {
      console.warn('Erro: Formulário de cadastro inválido.');
    }
  }

  login(): void {
    if (this.loginForm.valid) {
      let sanitizedData = {
        email: this.sanitizeInput(this.loginForm.value.email),
        password: this.loginForm.value.password,
      };

      console.log('Realizando login:', sanitizedData);
      this.userService.userLogin(sanitizedData);
    } else {
      console.warn('Erro: Formulário de login inválido.');
    }
  }

  openSignup(): void {
    console.log('Mudando para tela de Cadastro');
    this.showLogin = false;
  }

  openLogin(): void {
    console.log('Mudando para tela de Login');
    this.showLogin = true;
  }

  logout(): void {
    this.userService.logout();
    this.isLoggedIn = false;
    this.userName = '';
    console.log('Usuário deslogado.');
  }
}
