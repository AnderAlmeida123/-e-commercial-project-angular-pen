import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Arquivo que contém as rotas da aplicação
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user.service'; // Importe o UserService

export const appConfig: ApplicationConfig = {
  providers: [
    // Configurações do roteamento
    provideRouter(routes),

    // Ativa a reidratação do lado do cliente
    provideClientHydration(),

    // Configura o serviço HTTP com fetch
    provideHttpClient(withFetch()),

    // Importa o FormsModule para formulários reativos
    importProvidersFrom(FormsModule),

    // Registra o UserService globalmente
    UserService, // Adicionando o UserService aqui
  ],
};
