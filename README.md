# API-BANCO

## Seja bem-vindo à documentação da API RESTful para um sistema bancário Digital da CUBOS! Esta API foi desenvolvida para fornecer funcionalidades bancárias básicas, permitindo que você realize as seguintes operações:

1) Listar Contas
 2)  Criar conta bancária
 3)  Atualizar conta bancária
 4)  Excluir conta bancária
 5)  Realizar depósito
 6)  Realizar saque
 7) Realizar transferência
 8) Verificar Saldo
 9) Verificar Extrato

## Run

Para executar este projeto localmente, você precisa:

- Faça um clone do projeto
```bash
git clone https://github.com/Daian4/API-BANCO.git
```

- Instalar dependências

```shell
npm install
```

- Inicialize o servidor local: 

```shell
npm run start
```

<br/> 

### Criar uma nova conta bancária:

Endpoint: `POST` `/contas`

Descrição: Crie uma nova conta bancária fornecendo os dados do titular da conta.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

<br/> 

### Listar todas as contas bancárias:

Endpoint: `GET` `/contas?senha_banco=Cubos123Bank`

Descrição: Obtenha uma lista de todas as contas bancárias cadastradas no sistema.


-   **Requisição** - query params (respeitando este nome)

    -   senha_banco

<br/> 

### Atualizar informações do titular da conta:

Endpoint: `PUT` `/contas/:numeroConta/usuario`

Descrição: Atualize as informações do titular da conta bancária especificada por ID.

-   **Requisição** - O corpo (body) deverá possuir um objeto com todas as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

<br/> 

### Excluir uma conta bancária:

Endpoint:  `DELETE` `/contas/:numeroConta`

Descrição: Remova uma conta bancária do sistema com base no ID fornecido.

-   **Requisição**

    -   Numero da conta bancária (passado como parâmetro na rota)

<br/> 

### Realizar depósitos em uma conta bancária:

Endpoint: `POST` `/transacoes/depositar`

Descrição: Faça um depósito em uma conta bancária especificada por ID.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor


<br/> 

### Efetuar saques de uma conta bancária:

Endpoint: `POST` `/transacoes/sacar`

Descrição: Realize um saque de um valor em uma determinada conta bancária.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor
    -   senha


<br/> 

### Transferir fundos entre contas bancárias:

Endpoint: `POST` `/transacoes/transferir`

Descrição: Transfira fundos entre duas contas bancárias, fornecendo as informações necessárias.

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta_origem
    -   numero_conta_destino
    -   valor
    -   senha

<br/> 

### Consultar o saldo de uma conta bancária:

Endpoint: `GET` `/contas/saldo?numero_conta=123&senha=123`

Descrição: Obtenha o saldo atual de uma conta bancária especifica

-   **Requisição** - query params

    -   numero_conta
    -   senha

<br/> 

### Emitir extrato bancário:

Endpoint: `GET` `/contas/extrato?numero_conta=123&senha=123`

Descrição: Receba um extrato bancário detalhado de uma conta bancária especificada por ID.

-   **Requisição** - query params

    -   numero_conta
    -   senha

  <br/> 

## Tecnologias Ultilizadas 

[![My Skills](https://skillicons.dev/icons?i=javascript,nodejs,express,git,github&perline=3)](https://skillicons.dev)

  <br/> 

## Contato
Se você tiver dúvidas ou precisar entrar em contato, você pode me encontrar em daianalimaep@gmail.com

 ## Licença
[MIT](LICENSE)