import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { SellerService } from '../services/seller.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sellerService = inject(SellerService);

  // Verifica se há um vendedor salvo no localStorage
  if (localStorage.getItem('seller')) {
    return true;
  }

  // Verifica se o vendedor está autenticado corretamente
  return sellerService.isSellerLoggedIn.getValue(); // Aqui está a correção
};
