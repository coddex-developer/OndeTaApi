# Onde Tá API

API REST para rastreamento de encomendas com sistema de notificações e gerenciamento de usuários.

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

---

#### GET /api/profile
Obtém o perfil do usuário logado.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Resposta (200):**
```json
{
  "user": {
    "id": "uuid",
    "nome": "João Silva",
    "email": "joao@example.com",
    "criadoEm": "2024-12-20T15:30:00.000Z",
    "atualizadoEm": "2024-12-25T10:00:00.000Z",
    "_count": {
      "rastreamentos": 5,
      "notificacoes": 12
    }
  }
}
```

**Erros:**
- 401: Token não fornecido
- 404: Usuário não encontrado

---

#### PATCH /api/user/change-password/:id
Altera a senha do usuário (requer senha atual).

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Body:**
```json
{
  "senhaAtual": "senha_antiga123",
  "novaSenha": "nova_senha456"
}
```

**Resposta (200):**
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Erros:**
- 400: Dados inválidos ou senha atual incorreta
- 401: Token não fornecido
- 403: Tentativa de alterar senha de outro usuário

---

#### DELETE /api/user/:id
Deleta a conta do usuário.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Resposta (200):**
```json
{
  "message": "Conta deletada com sucesso"
}
```

**Erros:**
- 401: Token não fornecido
- 403: Tentativa de deletar conta de outro usuário
- 404: Usuário não encontrado

---

#### GET /api/user/stats
Obtém estatísticas do usuário logado.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Resposta (200):**
```json
{
  "stats": {
    "rastreamentos": {
      "total": 5,
      "porStatus": {
        "EM_TRANSITO": 2,
        "ENTREGUE": 2,
        "SAIU_PARA_ENTREGA": 1
      }
    },
    "notificacoes": {
      "total": 12,
      "naoLidas": 3
    }
  }
}
```

**Erros:**
- 401: Token não fornecido

---

### Rastreamentos (Requer Autenticação)

#### POST /api/rastreamentos
Cria um novo rastreamento.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Body:**
```json
{
  "codigo": "BR123456789BR",
  "nome": "Pacote Eletrônicos",
  "categoria": "Eletrônicos",
  "favorito": false,
  "statusAtual": "EM_TRANSITO",
  "previsaoEntrega": "2024-12-25T10:00:00.000Z"
}
```

**Resposta (201):**
```json
{
  "message": "Rastreamento criado com sucesso",
  "rastreamento": {
    "id": "uuid",
    "codigo": "BR123456789BR",
    "nome": "Pacote Eletrônicos",
    "categoria": "Eletrônicos",
    "favorito": false,
    "statusAtual": "EM_TRANSITO",
    "previsaoEntrega": "2024-12-25T10:00:00.000Z",
    "usuarioId": "uuid",
    "criadoEm": "2024-12-20T15:30:00.000Z",
    "eventos": []
  }
}
```

**Erros:**
- 400: Dados inválidos
- 401: Token não fornecido
- 409: Código já existe para este usuário

---

#### GET /api/rastreamentos
Lista todos os rastreamentos do usuário.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Resposta (200):**
```json
{
  "rastreamentos": [
    {
      "id": "uuid",
      "codigo": "BR123456789BR",
      "nome": "Pacote Eletrônicos",
      "categoria": "Eletrônicos",
      "favorito": false,
      "statusAtual": "EM_TRANSITO",
      "previsaoEntrega": "2024-12-25T10:00:00.000Z",
      "criadoEm": "2024-12-20T15:30:00.000Z",
      "eventos": [
        {
          "id": "uuid",
          "status": "SAIU_PARA_ENTREGA",
          "local": "Centro de Distribuição SP",
          "data": "2024-12-20T08:00:00.000Z"
        }
      ]
    }
  ]
}
```

---

#### GET /api/rastreamentos/:id
Busca um rastreamento específico.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Resposta (200):**
```json
{
  "rastreamento": {
    "id": "uuid",
    "codigo": "BR123456789BR",
    "nome": "Pacote Eletrônicos",
    "categoria": "Eletrônicos",
    "favorito": false,
    "statusAtual": "EM_TRANSITO",
    "previsaoEntrega": "2024-12-25T10:00:00.000Z",
    "criadoEm": "2024-12-20T15:30:00.000Z",
    "eventos": [
      {
        "id": "uuid",
        "status": "SAIU_PARA_ENTREGA",
        "local": "Centro de Distribuição SP",
        "data": "2024-12-20T08:00:00.000Z"
      }
    ]
  }
}
```

**Erros:**
- 400: ID inválido
- 401: Token não fornecido
- 404: Rastreamento não encontrado

---

#### PATCH /api/rastreamentos/:id
Atualiza um rastreamento.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Body:**
```json
{
  "nome": "Pacote Eletrônicos Atualizado",
  "favorito": true,
  "statusAtual": "ENTREGUE"
}
```

**Resposta (200):**
```json
{
  "message": "Rastreamento atualizado com sucesso",
  "rastreamento": {
    "id": "uuid",
    "codigo": "BR123456789BR",
    "nome": "Pacote Eletrônicos Atualizado",
    "categoria": "Eletrônicos",
    "favorito": true,
    "statusAtual": "ENTREGUE",
    "previsaoEntrega": "2024-12-25T10:00:00.000Z",
    "criadoEm": "2024-12-20T15:30:00.000Z",
    "eventos": [...]
  }
}
```

---

#### DELETE /api/rastreamentos/:id
Deleta um rastreamento.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Resposta (200):**
```json
{
  "message": "Rastreamento deletado com sucesso"
}
```

---

#### POST /api/rastreamentos/:id/eventos
Adiciona um evento ao rastreamento.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Body:**
```json
{
  "status": "ENTREGUE",
  "local": "Endereço do Destinatário",
  "data": "2024-12-25T14:30:00.000Z"
}
```

**Resposta (201):**
```json
{
  "message": "Evento adicionado com sucesso",
  "evento": {
    "id": "uuid",
    "rastreamentoId": "uuid",
    "status": "ENTREGUE",
    "local": "Endereço do Destinatário",
    "data": "2024-12-25T14:30:00.000Z"
  }
}
```

---

### Notificações (Requer Autenticação)

#### POST /api/notificacoes
Cria uma nova notificação.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Body:**
```json
{
  "mensagem": "Seu pacote foi entregue!",
  "lida": false
}
```

**Resposta (201):**
```json
{
  "message": "Notificação criada com sucesso",
  "notificacao": {
    "id": "uuid",
    "usuarioId": "uuid",
    "mensagem": "Seu pacote foi entregue!",
    "lida": false,
    "criadaEm": "2024-12-25T15:00:00.000Z"
  }
}
```

---

#### GET /api/notificacoes
Lista todas as notificações do usuário.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Resposta (200):**
```json
{
  "notificacoes": [
    {
      "id": "uuid",
      "usuarioId": "uuid",
      "mensagem": "Seu pacote foi entregue!",
      "lida": false,
      "criadaEm": "2024-12-25T15:00:00.000Z"
    }
  ]
}
```

---

#### GET /api/notificacoes/:id
Busca uma notificação específica.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Resposta (200):**
```json
{
  "notificacao": {
    "id": "uuid",
    "usuarioId": "uuid",
    "mensagem": "Seu pacote foi entregue!",
    "lida": false,
    "criadaEm": "2024-12-25T15:00:00.000Z"
  }
}
```

---

#### PATCH /api/notificacoes/:id
Atualiza uma notificação.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Body:**
```json
{
  "mensagem": "Mensagem atualizada",
  "lida": true
}
```

**Resposta (200):**
```json
{
  "message": "Notificação atualizada com sucesso",
  "notificacao": {
    "id": "uuid",
    "usuarioId": "uuid",
    "mensagem": "Mensagem atualizada",
    "lida": true,
    "criadaEm": "2024-12-25T15:00:00.000Z"
  }
}
```

---

#### DELETE /api/notificacoes/:id
Deleta uma notificação.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Resposta (200):**
```json
{
  "message": "Notificação deletada com sucesso"
}
```

---

#### PATCH /api/notificacoes/:id/read
Marca uma notificação como lida.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Resposta (200):**
```json
{
  "message": "Notificação marcada como lida"
}
```

---

#### PATCH /api/notificacoes/read-all
Marca todas as notificações como lidas.

**Headers:**
```
Authorization: Bearer seu_token_jwt
```

**Resposta (200):**
```json
{
  "message": "Todas as notificações foram marcadas como lidas"
}
```

---

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
