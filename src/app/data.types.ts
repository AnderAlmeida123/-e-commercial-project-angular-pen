// Interface que define a estrutura dos dados para cadastro de um vendedor
export interface SignUp {
  name: string; // Nome do vendedor
  password: string; // Senha do vendedor
  email: string; // Email do vendedor
}

// Interface que define a estrutura dos dados para login de um vendedor
export interface login {
  email: string; // Email do vendedor
  password: string; // Senha do vendedor
}

export interface product {
  name: string;
  price: string;
  category: string;
  color: string;
  description: string;
  image: string;
  id: number;
}

/*
🔎 O que esse código faz?
Define as interfaces SignUp e login, que padronizam os dados que serão enviados e recebidos no sistema de autenticação.
Melhora a tipagem do TypeScript, garantindo que os objetos de login e cadastro tenham os campos corretos.

*/
