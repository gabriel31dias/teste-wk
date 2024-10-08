export interface Person {
    id?: string;
    name: string;
    email: string;
    phone: string;
    birth_date: string;
}


export interface Person2 {
    id?: string;
    nome: string;
    cpf: string;
    cep: string;
    logradouro: string;
    numero: number;
    bairro: string;
    complemento: string;
    cidade: string;
    email: string;
    dataNascimento?: Date;
  }