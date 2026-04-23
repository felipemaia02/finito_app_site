# Finito — Controle Financeiro

Interface web moderna para o sistema de controle financeiro **Finito**, desenvolvida em React + TypeScript com Material UI.

---

## Stack

| Biblioteca | Versão | Uso |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Bundler |
| TypeScript | 5 | Tipagem |
| Material UI | 5 | Componentes visuais |
| React Router | 6 | Navegação |
| Axios | 1.7 | Client HTTP |
| TanStack Query | 5 | Cache e estado de servidor |
| Recharts | 2 | Gráficos |
| React Hook Form + Zod | 7 + 3 | Formulários e validação |
| notistack | 3 | Toasts/notificações |

---

## Pré-requisitos

- **Node.js** >= 18
- Back-end Finito rodando em `http://localhost:8000`

---

## Instalação

```bash
# Clone o repositório
git clone <url>
cd finito_app_site

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# edite o .env com os valores corretos
```

### Variáveis de ambiente (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_KEY=your-secret-api-key-change-in-env
```

> `VITE_API_KEY` deve ser o mesmo valor configurado em `API_KEY_SECRET` no back-end.

---

## Rodando em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## Build de produção

```bash
npm run build
npm run preview
```

---

## Estrutura do projeto

```
src/
├── app/           # QueryClient
├── components/
│   ├── common/    # Componentes reutilizáveis (StatCard, EmptyState, etc.)
│   ├── dashboard/ # Gráficos, cards, ranking
│   └── expenses/  # ExpenseForm, ExpenseTable
├── constants/     # Rotas, categorias, tipos de pagamento
├── context/       # AuthContext, GroupContext, ThemeContext
├── hooks/         # useExpenses, useAuth, useGroup, useUsers
├── layouts/       # MainLayout (sidebar + header), AuthLayout
├── pages/
│   ├── auth/      # Login, Cadastro
│   ├── dashboard/ # Dashboard principal
│   ├── expenses/  # Lista, Criar, Editar, Detalhe
│   ├── groups/    # Seletor de grupo
│   ├── profile/   # Perfil do usuário
│   └── settings/  # Configurações
├── routes/        # Router + ProtectedRoute
├── services/      # api.ts (Axios + interceptors), authService, userService, expenseService
├── theme/         # lightTheme, darkTheme
├── types/         # auth.ts, users.ts, expenses.ts
└── utils/         # currency, dates, labels, analytics
```

---

## Fluxo de autenticação

1. `POST /auth/login` → tokens retornados e salvos no `localStorage`
2. `POST /auth/validate` → extrai email do token → `GET /users/email/{email}` → dados do usuário em cache
3. **Interceptor Axios** injeta automaticamente `Authorization: Bearer <token>` e `x-api-key` em todas as rotas
4. Quando o access token expira (401), o interceptor chama `POST /auth/refresh` automaticamente
5. Se o refresh falhar, redireciona para `/login`

---

## Gerenciamento de grupos

Como a API não possui CRUD de grupos, o front-end oferece:

- Formulário para informar o **Group ID** (string MongoDB ObjectId)
- Histórico dos últimos 5 grupos usados (via `localStorage`)
- Seletor rápido no header/dashboard
- Persistência do último grupo ativo

---

## Telas disponíveis

| Rota | Tela |
|---|---|
| `/login` | Login |
| `/register` | Cadastro |
| `/dashboard` | Dashboard com gráficos e analytics |
| `/expenses` | Listagem de despesas com filtros e paginação |
| `/expenses/new` | Criar despesa |
| `/expenses/:id` | Detalhe da despesa |
| `/expenses/:id/edit` | Editar despesa |
| `/groups` | Seletor / configuração de grupos |
| `/profile` | Perfil do usuário |
| `/settings` | Configurações (tema, etc.) |

---

## Endpoints utilizados

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Renovação de token (automático) |
| POST | `/auth/validate` | Validação de sessão |
| POST | `/users/register` | Cadastro |
| GET | `/users/email/{email}` | Busca usuário pós-login |
| GET/PUT/DELETE | `/users/{user_id}` | Perfil |
| POST | `/expenses` | Criar despesa |
| GET | `/expenses/{group_id}` | Listar despesas do grupo |
| GET | `/expenses/{expense_id}/details` | Detalhe |
| PATCH | `/expenses/{expense_id}` | Editar |
| DELETE | `/expenses/{expense_id}` | Excluir |
| GET | `/expenses/{group_id}/analytics` | Dados para dashboard |
