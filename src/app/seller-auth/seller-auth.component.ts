// Importações necessárias do Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importando FormsModule para usar ngForm
import { SellerService } from '../../services/seller.service'; // Importação do serviço que lida com autenticação de vendedores
import { HttpClientModule } from '@angular/common/http'; // Importação para realizar requisições HTTP
import { Router } from '@angular/router';
import { SignUp } from '../data.types'; // Importação da interface que define os dados de cadastro/login

@Component({
  selector: 'app-seller-auth', // Nome do seletor para chamar esse componente no HTML
  standalone: true, // Define que o componente pode ser usado independentemente de um módulo
  imports: [CommonModule, FormsModule, HttpClientModule], // Módulos necessários para manipulação do formulário e requisições HTTP
  templateUrl: './seller-auth.component.html', // Arquivo HTML associado ao componente
  styleUrls: ['./seller-auth.component.css'], // Arquivo CSS associado ao componente
})
export class SellerAuthComponent implements OnInit {
  showLogin = false; // Controla qual formulário será exibido (cadastro ou login)
  authError: String = ''; // Armazena mensagens de erro de autenticação

  constructor(private seller: SellerService, private router: Router) {}

  // Método do ciclo de vida chamado quando o componente é inicializado
  ngOnInit(): void {
    this.seller.reloadSeller(); // Verifica se o usuário já está logado e redireciona caso positivo
  }

  // Função chamada quando o usuário preenche o formulário de cadastro e clica no botão "Cadastrar"
  signUp(data: SignUp): void {
    this.seller.userSignUp(data); // Chama o serviço para cadastrar o vendedor
  }

  // Função chamada quando o usuário preenche o formulário de login e clica no botão "Login"
  login(data: SignUp): void {
    this.seller.userLogin(data); // Chama o serviço para autenticar o vendedor

    // Se houver erro no login, exibe a mensagem na tela
    this.seller.isLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = 'Email ou senha não correspondem';
      }
    });
  }

  // Alterna para o formulário de login
  openLogin() {
    this.showLogin = true;
  }

  // Alterna para o formulário de cadastro
  openSignUp() {
    this.showLogin = false;
  }
}

/*
🔎 O que esse código faz?
Gerencia a autenticação do vendedor, permitindo que ele se cadastre ou faça login.
Controla qual formulário será exibido (showLogin → true mostra o login, false mostra o cadastro).
Faz requisições HTTP para cadastrar ou autenticar o vendedor através do SellerService.
Redireciona o usuário se ele já estiver logado, chamando reloadSeller() no ngOnInit().
Exibe mensagens de erro caso o login falhe (authError).
🛠 Possíveis melhorias
Evitar múltiplas assinaturas no subscribe()
O subscribe() dentro de login() pode gerar múltiplas execuções indesejadas.
Melhor usar o BehaviorSubject de outra forma ou um async pipe no template.

Validar os campos antes de enviar os dados
Atualmente, não há validação nos campos.
Podemos adicionar validação usando Validators do Angular Forms.
*/
