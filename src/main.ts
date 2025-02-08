import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * O `bootstrapApplication()` inicializa a aplicação Angular.
 * Ele recebe dois parâmetros:
 * 1. `AppComponent`: O componente raiz da aplicação.
 * 2. `appConfig`: As configurações globais da aplicação (rotas, HTTP, formulários, etc.).
 *
 * Caso ocorra um erro ao iniciar a aplicação, ele será capturado e exibido no console.
 */
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error('Erro ao iniciar a aplicação:', err)
);
