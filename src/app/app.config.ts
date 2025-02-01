import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Supondo que você tenha um arquivo de rotas
import { provideClientHydration } from '@angular/platform-browser';

// Importando os componentes que serão utilizados diretamente
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SellerAuthComponent } from './seller-auth/seller-auth.component';
import { FormsModule } from '@angular/forms'; // Para incluir o FormsModule

export const appConfig: ApplicationConfig = {
  providers: [
    // Fornecendo as rotas e funcionalidades de hidratação do cliente
    provideRouter(routes),
    provideClientHydration(),
    FormsModule, // Aqui você adiciona o FormsModule se necessário
    { provide: AppComponent, useClass: AppComponent },
    { provide: HeaderComponent, useClass: HeaderComponent },
    { provide: HomeComponent, useClass: HomeComponent },
    { provide: SellerAuthComponent, useClass: SellerAuthComponent },
  ],
};
