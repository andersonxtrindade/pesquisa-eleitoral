# Projeto de Pesquisa Eleitoral

Este projeto é uma aplicação que permite a coleta e análise de dados de pesquisas eleitorais. Ele é dividido em duas partes: **backend** e **frontend**.

## Estrutura do Projeto

- **Backend**: Desenvolvido em Node.js utilizando o framework Express, com um banco de dados SQLite.
- **Frontend**: Desenvolvido em React com Bootstrap e Vite, localizado na pasta `frontend/pesquisa-eleitoral`.

## Pré-requisitos

Antes de iniciar o projeto, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/) (geralmente já incluído com o Node.js)

## Inicializando o Projeto

### Clonando o Repositório

Primeiro, clone o repositório em sua máquina local:

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>
```

### Configurando o Backend

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências do projeto:
```bash
npm install
```

3. Inicialize o servidor:

```bash
npm run dev
```

O backend estará rodando, por padrão, na porta 3000. Você pode acessar a API através de http://localhost:3000.

### Configurando o Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend/pesquisa-eleitoral
```

2. Instale as dependências do projeto:
```bash
npm install
```

3. Inicie a aplicação React com Vite:
```bash
npm run dev
```

O frontend estará rodando, por padrão, na porta 5173. Você pode acessar a aplicação através de http://localhost:5173.

## Considerações Finais
Após seguir os passos acima, o projeto deverá estar funcionando em sua máquina local. Se você encontrar algum problema, verifique as mensagens de erro no console e assegure-se de que todas as dependências estão instaladas corretamente.