# Integração com APIs e Serviços

## 🗄️ Supabase Integration

### Configuração Base
**Arquivo**: `services/supa_init.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})
```

### Variáveis de Ambiente
```env
# .env
SUPABASE_DB_URL=postgresql://postgres:1@NKDG7XdD2Aye8I3w@db.oifhsdqivbiyyvfheofx.supabase.co:5432/postgres
VITE_SUPABASE_URL=https://oifhsdqivbiyyvfheofx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔐 Autenticação

### Métodos Disponíveis
**Arquivo**: `src/components/auth/AuthProvider.tsx`

#### Login
```typescript
const login = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { error };
};
```

#### Registro
```typescript
const register = async (email: string, password: string, name: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: name },
    },
  });
  return { error };
};
```

#### Logout
```typescript
const logout = async () => {
  await supabase.auth.signOut();
};
```

#### Alteração de Senha
```typescript
const changePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  return { error };
};
```

#### Recuperação de Senha
```typescript
const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}?reset-password=true`,
  });
  return { error };
};
```

### Gerenciamento de Sessão
```typescript
// Obter sessão atual
const { data: { session }, error } = await supabase.auth.getSession();

// Escutar mudanças de autenticação
supabase.auth.onAuthStateChange((_event, session) => {
  setSession(session);
  setUser(session?.user ?? null);
});
```

## 🚀 Edge Functions

### DT_LOGIN_NEW_SESSION
**Localização**: `supabase/functions/DT_LOGIN_NEW_SESSION/index.ts`
**Método**: POST
**Autenticação**: Bearer Token obrigatório

#### Funcionalidade
- Cria nova sessão de chat na tabela `tab_chat_session`
- Valida token de autenticação do usuário
- Retorna dados da sessão criada

#### Request
```typescript
// Headers obrigatórios
{
  'Authorization': `Bearer ${session.access_token}`,
  'Content-Type': 'application/json'
}
```

#### Response Success
```typescript
{
  success: true,
  session: {
    session_id: string,
    session_title: string,
    user_id: string,
    session_time: string
  }
}
```

#### Response Error
```typescript
{
  success: false,
  error: string
}
```

#### Implementação no Frontend
**Arquivo**: `services/supabase.ts`

```typescript
export async function FUN_DT_LOGIN_NEW_SESSION() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.access_token) {
      throw new Error('Usuário não está logado');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const functionUrl = `${supabaseUrl}/functions/v1/DT_LOGIN_NEW_SESSION`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return {
      success: data.success,
      session: data.session,
      error: data.success ? null : data.error
    };
  } catch (error) {
    return {
      success: false,
      session: null,
      error: error.message
    };
  }
}
```

## 🗃️ Estrutura do Banco de Dados

### Tabela: tab_chat_session
```sql
CREATE TABLE tab_chat_session (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_title TEXT NOT NULL DEFAULT 'Nova Sessão',
  user_id UUID NOT NULL REFERENCES auth.users(id),
  session_time TIMESTAMPTZ DEFAULT now()
);
```

#### Campos
- **session_id**: UUID único da sessão
- **session_title**: Título da sessão (padrão: "Nova Sessão")
- **user_id**: Referência ao usuário autenticado
- **session_time**: Timestamp UTC de criação

## 🕐 Utilitários de Timezone

### Funções Disponíveis
**Arquivo**: `src/utils/timezone.ts`

#### getCurrentTimestampUTC()
```typescript
export function getCurrentTimestampUTC(): string {
  return new Date().toISOString();
}
```

#### formatDateTimeBR(date)
```typescript
export function formatDateTimeBR(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  }).replace(',', ' -');
}
```

#### formatTimeBR(date)
```typescript
export function formatTimeBR(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  });
}
```

## 🔄 Padrões de Integração

### Error Handling
```typescript
try {
  const result = await apiCall();
  if (result.error) {
    // Tratar erro da API
    console.error('API Error:', result.error);
    return { success: false, error: result.error };
  }
  return { success: true, data: result.data };
} catch (error) {
  // Tratar erro de rede/conexão
  console.error('Network Error:', error);
  return { success: false, error: 'Erro de conexão' };
}
```

### Loading States
```typescript
const [loading, setLoading] = useState(false);

const handleApiCall = async () => {
  setLoading(true);
  try {
    const result = await apiFunction();
    // Processar resultado
  } finally {
    setLoading(false);
  }
};
```

### Autenticação em Requests
```typescript
// Sempre verificar se há sessão ativa
const { data: { session } } = await supabase.auth.getSession();

if (!session?.access_token) {
  throw new Error('Usuário não autenticado');
}

// Incluir token no header
const headers = {
  'Authorization': `Bearer ${session.access_token}`,
  'Content-Type': 'application/json'
};
```

## 🛡️ Segurança

### CORS Configuration
**Edge Functions**:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
```

### Token Validation
```typescript
// Validar token antes de operações sensíveis
const { data: { user }, error } = await supabaseUser.auth.getUser();

if (error || !user) {
  return new Response(JSON.stringify({ 
    success: false, 
    error: 'Invalid or expired token' 
  }), { status: 401 });
}
```

### Environment Variables
- Nunca expor service role key no frontend
- Usar VITE_ prefix para variáveis do frontend
- Validar presença de variáveis obrigatórias