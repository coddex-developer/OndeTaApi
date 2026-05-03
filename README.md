# Onde Tá API

API REST Onde Tá.

## Instalação

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn

### Passos

1. Clone ou navegue até a pasta do projeto:
```bash
cd OndeTaApi
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (veja a seção abaixo).

4. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Porta em que o servidor rodará (padrão: 3000)
PORT=3000

# String secreta para assinar tokens JWT
# Gere uma string segura e complexa
JWT_SECRET=sua_chave_secreta_muito_segura_e_complexa_aqui

# URL de conexão com o banco de dados PostgreSQL
# Formato: postgresql://usuario:senha@localhost:5432/nome_banco
DATABASE_URL=postgresql://usuario:senha@localhost:5432/ondeta
```

### Explicação das variáveis:

- **PORT**: Define a porta que a aplicação vai usar. Se não especificada, usa 3000.
- **JWT_SECRET**: Chave privada usada para assinar e verificar tokens JWT. Deve ser uma string forte e única. Nunca compartilhe ou exponha essa chave.
- **DATABASE_URL**: String de conexão com o PostgreSQL. Substitua `usuario`, `senha`, `localhost`, `5432` e `ondeta` pelos seus valores reais.

## Rotas

Todas as rotas são prefixadas com `/api`

### Autenticação

#### POST /api/register
Registra um novo usuário.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta (201):**
```json
{
  "message": "Conta criada com sucesso",
  "user": {
    "id": "uuid",
    "email": "joao@example.com",
    "nome": "João Silva"
  }
}
```

**Erros:**
- 400: Dados inválidos
- 409: Email já cadastrado

---

#### POST /api/login
Realiza login e retorna um token JWT.

**Body:**
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta (200):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "joao@example.com",
    "nome": "João Silva"
  }
}
```

**Erros:**
- 400: Dados inválidos
- 401: Email ou senha inválidos

---

### Usuários (Requer Autenticação)

#### PATCH /api/user/update/:id
Atualiza os dados do usuário. Requer token JWT no header.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Body:**
```json
{
  "nome": "João Silva Atualizado",
  "email": "novo_email@example.com",
  "senha": "nova_senha123"
}
```

**Resposta (200):**
```json
{
  "message": "Conta atualizada com sucesso",
  "user": {
    "id": "uuid",
    "email": "novo_email@example.com",
    "nome": "João Silva Atualizado"
  }
}
```

**Erros:**
- 400: Dados inválidos
- 401: Token não fornecido ou inválido
- 404: Usuário não encontrado
- 409: Email já cadastrado

## Autenticação

As rotas que exigem autenticação necessitam de um token JWT válido no header:

```
Authorization: Bearer <seu_token_jwt>
```

O token é válido por 7 dias após a geração.

## Stack Tecnológico

- Express.js - Framework web
- TypeScript - Linguagem tipada
- Prisma - ORM para banco de dados
- PostgreSQL - Banco de dados
- JWT - Autenticação
- Bcrypt - Hash de senhas
- Zod - Validação de dados
