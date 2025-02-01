import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importando FormsModule para usar ngForm

@Component({
  selector: 'app-seller-auth',
  standalone: true,
  imports: [CommonModule, FormsModule], // Incluindo CommonModule e FormsModule
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'], // Correção: "styleUrl" → "styleUrls"
})
export class SellerAuthComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  signUp(data: object): void {
    console.warn(data);
  }
}
