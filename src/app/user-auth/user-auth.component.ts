import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { login, signUp } from '../data.types';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  userName: string = ''; // 🔹 Adicionado para armazenar o nome do usuário

  constructor(private user: UserService, private router: Router) {}

  ngOnInit(): void {
    console.log('UserAuthComponent inicializado.');

    // Atualiza o estado de login e nome do usuário
    this.user.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.updateUserName();
      console.log('Estado de login atualizado:', this.isLoggedIn);
    });

    // Atualiza o nome do usuário ao carregar o componente
    this.updateUserName();
  }

  private updateUserName() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.userName = userData.name || ''; // 🔹 Atualiza o nome do usuário
    }
  }

  signUp(data: signUp) {
    console.log('Chamando signUp() com os dados:', data);
    this.user.userSignup(data);
  }

  login(data: login) {
    console.log('Chamando login() com os dados:', data);
    this.user.userLogin(data);
  }

  openSignup() {
    console.log('Mudando para tela de Cadastro');
    this.showLogin = false;
  }

  openLogin() {
    console.log('Mudando para tela de Login');
    this.showLogin = true;
  }

  logout() {
    this.user.logout();
    this.isLoggedIn = false;
    this.userName = ''; // 🔹 Limpa o nome do usuário ao sair
  }
}
