import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importando FormsModule para usar ngForm
import { SellerService } from '../../services/seller.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignUp } from '../data.types';

@Component({
  selector: 'app-seller-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Incluindo CommonModule e FormsModule
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'], // Correção: "styleUrl" → "styleUrls"
})
export class SellerAuthComponent implements OnInit {
  showLogin = false;
  authError: String = '';
  constructor(private seller: SellerService, private router: Router) {}

  ngOnInit(): void {
    this.seller.reloadSeller();
  }

  signUp(data: SignUp): void {
    this.seller.userSignUp(data);
  }

  login(data: SignUp): void {
    this.seller.userLogin(data);
    this.seller.isLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = 'Email ou senha nao corresponde';
      }
    });
  }

  openLogin() {
    this.showLogin = true;
  }
  openSignUp() {
    this.showLogin = false;
  }
}
