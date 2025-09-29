# Arquitetura do Sistema VT_DANTE_LAB

## Schema publico do Banco de dados supabase, sempre consulte esse schema abaixo paara criar qualquer codigo CRUD, funcoes, edge functions, api calls etc, siga a risca o schema abaixo:

"-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.tab_chat_msg (
  chat_msg_id uuid NOT NULL,
  chat_session_id uuid,
  user_id uuid NOT NULL,
  msg_input text,
  msg_output text,
  msg_chunk text,
  msg_memory text,
  msg_time timestamp with time zone DEFAULT now(),
  CONSTRAINT tab_chat_msg_pkey PRIMARY KEY (chat_msg_id),
  CONSTRAINT tab_chat_msg_chat_session_id_fkey FOREIGN KEY (chat_session_id) REFERENCES public.tab_chat_session(chat_session_id),
  CONSTRAINT tab_chat_msg_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.tab_user(user_id)
);
CREATE TABLE public.tab_chat_session (
  chat_session_id uuid NOT NULL,
  chat_session_title text,
  user_id uuid NOT NULL,
  session_time timestamp with time zone DEFAULT now(),
  CONSTRAINT tab_chat_session_pkey PRIMARY KEY (chat_session_id),
  CONSTRAINT tab_session_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.tab_user(user_id)
);
CREATE TABLE public.tab_payment (
  pay_id uuid NOT NULL,
  user_id uuid NOT NULL,
  pay_provider text,
  pay_amount numeric,
  pay_status text CHECK (pay_status = ANY (ARRAY['paid'::text, 'pending'::text, 'failed'::text, 'refunded'::text])),
  pay_currency text,
  pay_time timestamp with time zone DEFAULT now(),
  pay_external_id text,
  CONSTRAINT tab_payment_pkey PRIMARY KEY (pay_id),
  CONSTRAINT tab_payment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.tab_user(user_id)
);
CREATE TABLE public.tab_report (
  report_id uuid NOT NULL,
  user_id uuid NOT NULL,
  report_msg text,
  report_time timestamp with time zone DEFAULT now(),
  report_gabarito text,
  CONSTRAINT tab_report_pkey PRIMARY KEY (report_id),
  CONSTRAINT tab_report_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.tab_user(user_id)
);
CREATE TABLE public.tab_user (
  user_id uuid NOT NULL,
  user_name text,
  user_active boolean DEFAULT true,
  user_role text CHECK (user_role = ANY (ARRAY['free'::text, 'pro'::text, 'premium'::text, 'admin'::text])),
  user_role_status text CHECK (user_role_status = ANY (ARRAY['active'::text, 'canceled'::text, 'trial'::text, 'admin'::text])),
  user_pay_provider text,
  user_pay_id text,
  CONSTRAINT tab_user_pkey PRIMARY KEY (user_id),
  CONSTRAINT tab_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);".



## 📁 Estrutura de Pastas

```
VT_DANTE/
├── .env                          # Variáveis de ambiente
├── package.json                  # Dependências e scripts
├── vite.config.ts               # Configuração do Vite
├── tailwind.config.js           # Configuração do Tailwind
├── src/
│   ├── App.tsx                  # Componente raiz com roteamento
│   ├── main.tsx                 # Entry point da aplicação
│   ├── components/              # Componentes reutilizáveis
│   │   ├── auth/               # Sistema de autenticação
│   │   │   ├── AuthProvider.tsx     # Context de autenticação
│   │   │   ├── AuthModal.tsx        # Modal de login/registro
│   │   │   ├── ResetPasswordModal.tsx
│   │   │   └── EmailConfirmationModal.tsx
│   │   ├── ui/                 # Componentes base (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── [outros componentes UI]
│   │   ├── header.tsx          # Header principal
│   │   ├── chat_area.tsx       # Área principal do chat
│   │   ├── chat_input.tsx      # Input de mensagens
│   │   ├── chat_msg_list.tsx   # Lista de mensagens
│   │   ├── sidebar_collapse.tsx # Sidebar do chat
│   │   ├── user_profile_icon.tsx
│   │   ├── user_profile_panel.tsx
│   │   └── [outros componentes]
│   ├── pages/                  # Páginas da aplicação
│   │   ├── HomePage.tsx        # Landing page
│   │   ├── ChatPage.tsx        # Página do chat
│   │   ├── DanteUI.tsx         # Paleta de cores
│   │   ├── BaseLegal.tsx       # Informações legais
│   │   ├── ComoFunciona.tsx    # Como funciona
│   │   ├── Contato.tsx         # Contato
│   │   ├── Planos.tsx          # Planos de assinatura
│   │   ├── TestePage.tsx       # Página de testes
│   │   └── PayloadTest.tsx     # Testes de payload
│   ├── utils/                  # Utilitários
│   │   └── timezone.ts         # Funções de timezone
│   └── lib/                    # Configurações e libs
├── services/                   # Integração com serviços
│   ├── supa_init.ts            # Inicialização do Supabase
│   ├── supabase.ts             # Funções do Supabase
│   └── react.ts                # Funções do frontend React
└── supabase/                   # Edge Functions
    └── functions/
        ├── DT_LOGIN_NEW_SESSION/
        │   └── index.ts       # Criação de sessão de chat
        └── single_session/
            └── index.ts       # Gerenciamento de sessão
```

## 🔧 Componentes Principais

### App.tsx - Componente Raiz
- **Responsabilidades**:
  - Roteamento principal da aplicação
  - Error Boundary global
  - Gerenciamento de modais de autenticação
  - Detecção de redirects de autenticação (email confirmation, password reset)
  - Loading state inicial

### AuthProvider - Contexto de Autenticação
- **Estado Global**:
  - `user`: Usuário atual (User | null)
  - `session`: Sessão ativa (Session | null)
  - `loading`: Estado de carregamento
- **Métodos**:
  - `login(email, password)`: Autenticação
  - `register(email, password, name)`: Registro
  - `logout()`: Logout
  - `changePassword(newPassword)`: Alteração de senha
  - `resetPassword(email)`: Recuperação de senha

### ChatArea - Interface Principal do Chat
- **Estado Local**:
  - `messages`: Array de mensagens
  - `isLoading`: Estado de carregamento
- **Funcionalidades**:
  - Envio de mensagens
  - Simulação de consulta à base legal
  - Loading sequence elaborada
  - Scroll automático
  - Respostas contextualizadas sobre Registro de Imóveis

## 🗄️ Integração com Supabase

### Configuração
```typescript
// services/supa_init.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})
```

### Edge Functions
- **DT_LOGIN_NEW_SESSION**: 
  - Cria nova sessão de chat na tabela `tab_chat_session`
  - Valida token de autenticação
  - Retorna dados da sessão criada

### Tabelas do Banco
- **tab_chat_session**:
  - `session_id`: UUID único
  - `session_title`: Título da sessão
  - `user_id`: ID do usuário
  - `session_time`: Timestamp UTC (DEFAULT now())

## 🎨 Sistema de Design

### Tailwind Configuration
- **Cores customizadas**: Paleta completa definida
- **Animações**: tailwindcss-animate plugin
- **Responsividade**: Mobile-first approach
- **Dark mode**: Configurado mas não implementado

### Componentes UI (Radix + shadcn/ui)
- **Button**: Variantes (default, outline, ghost)
- **Dialog**: Modais e overlays
- **Input**: Campos de formulário
- **Tooltip**: Dicas contextuais
- **Badge**: Indicadores
- **Card**: Containers de conteúdo

## 🔄 Fluxo de Dados

### Autenticação
```
User Input → AuthModal → Supabase Auth → AuthProvider → Global State
```

### Chat
```
User Message → ChatArea → Edge Function → Database → Response Simulation
```

### Navegação
```
Header Navigation → React Router → Page Components → Conditional Rendering
```

## 🛡️ Segurança

### Autenticação
- JWT tokens via Supabase Auth
- Refresh token automático
- Session persistence
- Protected routes

### Validação
- Input sanitization
- Error boundaries
- CORS headers nas Edge Functions
- Environment variables para secrets

## 📱 Responsividade

### Breakpoints (Tailwind padrão)
- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+

### Estratégia Mobile-First
- Layout flexível com CSS Grid/Flexbox
- Menu hambúrguer para mobile
- Touch-friendly components
- Viewport meta tag configurada