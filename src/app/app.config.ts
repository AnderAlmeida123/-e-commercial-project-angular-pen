import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Arquivo que contém as rotas da aplicação
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

/**
 * `appConfig` é a configuração global da aplicação Angular.
 * Aqui definimos os "providers", que são serviços e módulos globais usados no projeto.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * `provideRouter(routes)`: Configura o roteamento da aplicação.
     * - `routes` é um array com as definições de caminhos e componentes associados.
     */
    provideRouter(routes),

    /**
     * `provideClientHydration()`: Ativa a reidratação do lado do cliente.
     * - Isso é útil para aplicações que usam Server-Side Rendering (SSR).
     */
    provideClientHydration(),

    /**
     * `provideHttpClient(withFetch())`: Configura o serviço HTTP do Angular.
     * - `withFetch()` permite que a aplicação use `fetch()` em vez de `XMLHttpRequest`,
     *   melhorando o desempenho e a compatibilidade com SSR.
     */
    provideHttpClient(withFetch()),

    /**
     * `importProvidersFrom(FormsModule)`: Habilita o uso do `FormsModule` para formulários reativos.
     * - Isso permite trabalhar com formulários no Angular sem precisar importar o módulo manualmente nos componentes.
     */
    importProvidersFrom(FormsModule),
  ],
};
