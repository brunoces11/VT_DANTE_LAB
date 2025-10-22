# Design Document - Front Access Level

## Overview

Este documento descreve o design técnico para implementar um sistema minimalista de controle de visibilidade de UI baseado em `user_role`. A solução estende o `AuthProvider` existente para incluir informações de role do usuário e fornece um hook customizado (`useUserRole`) para acesso simplificado em qualquer componente da aplicação.

A arquitetura segue o padrão Supabase de desenvolvimento, utilizando o cliente oficial para queries, mantendo dados no React Context para performance, e seguindo as convenções do projeto existente.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  header.tsx  │  │ Other Pages  │  │  Components  │      │
│  │              │  │              │  │              │      │
│  │ useUserRole()│  │ useUserRole()│  │ useUserRole()│      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Context Layer                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │           AuthProvider (Extended)                  │     │
│  │  - user: User | null                               │     │
│  │  - session: Session | null                         │     │
│  │  - userRole: string | null  ◄── NEW               │     │
│  │  - loading: boolean                                │     │
│  │  - login(), logout(), register()...                │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Service Layer                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │         services/supabase.ts                       │     │
│  │  - getUserRole(userId: string)  ◄── NEW           │     │
│  │  - Other existing functions...                     │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Database Layer                            │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Supabase PostgreSQL                        │     │
│  │  tab_user:                                         │     │
│  │    - user_id (uuid, PK)                            │     │
│  │    - user_role (text, nullable)                    │     │
│  │      CHECK: 'free'|'pro'|'premium'|'admin'|'sadmin'│     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Login Flow:**
```
1. User submits credentials
   ↓
2. AuthProvider.login() → Supabase Auth
   ↓
3. Auth success → Get user.id
   ↓
4. Call getUserRole(user.id) → Query tab_user
   ↓
5. Store userRole in AuthContext state
   ↓
6. Components using useUserRole() re-render
   ↓
7. Conditional UI elements appear/disappear
```

**Component Render Flow:**
```
1. Component mounts
   ↓
2. Calls useUserRole()
   ↓
3. Hook reads from AuthContext
   ↓
4. Returns userRole (or null)
   ↓
5. Component renders conditionally
   ↓
6. If role === 'sadmin' → Show protected element
   ↓
7. Otherwise → Hide element
```

## Components and Interfaces

### 1. Extended AuthContext Interface

```typescript
// src/components/auth/AuthProvider.tsx

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;  // ◄── NEW
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
```

**Modificações no AuthProvider:**
- Adicionar estado `userRole` usando `useState<string | null>(null)`
- Após login bem-sucedido, chamar `getUserRole(user.id)` e armazenar resultado
- No logout, resetar `userRole` para `null`
- Expor `userRole` no value do Context

### 2. Hook useUserRole

```typescript
// src/hooks/useUserRole.ts

export function useUserRole(): string | null {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useUserRole must be used within AuthProvider');
  }
  
  return context.userRole;
}
```

**Características:**
- Simples e direto
- Retorna `string | null`
- Lança erro se usado fora do AuthProvider
- Causa re-render automático quando role muda

### 3. Service Function - getUserRole

```typescript
// services/supabase.ts

export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('tab_user')
      .select('user_role')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    return data?.user_role || null;
  } catch (err) {
    console.error('Unexpected error fetching user role:', err);
    return null;
  }
}
```

**Características:**
- Usa Supabase Client oficial
- Query simples e performática
- Error handling robusto (fail-safe)
- Retorna `null` em caso de erro
- Segue padrão do arquivo existente

### 4. Header Component Modification

```typescript
// src/components/header.tsx

import { useUserRole } from '@/hooks/useUserRole';

export default function Header() {
  const role = useUserRole();
  
  return (
    <header>
      {/* Existing menu items */}
      <MenuItem to="/">Home</MenuItem>
      <MenuItem to="/chat">Chat</MenuItem>
      
      {/* Conditional Lab menu - only for sadmin */}
      {role === 'sadmin' && (
        <MenuItem to="/lab">Lab</MenuItem>
      )}
      
      {/* Other menu items */}
    </header>
  );
}
```

**Características:**
- Renderização condicional simples
- Sem flicker (elemento oculto por padrão)
- Fácil de entender e manter
- Padrão reutilizável

## Data Models

### Database Schema (Existing)

```sql
CREATE TABLE public.tab_user (
  user_id uuid NOT NULL,
  user_name text,
  user_active boolean DEFAULT true,
  user_role text CHECK (user_role = ANY (ARRAY[
    'free'::text, 
    'pro'::text, 
    'premium'::text, 
    'admin'::text, 
    'sadmin'::text  -- Added via migration
  ])),
  user_role_status text CHECK (user_role_status = ANY (ARRAY[
    'active'::text, 
    'canceled'::text, 
    'trial'::text, 
    'admin'::text
  ])),
  user_pay_provider text,
  user_pay_id text,
  CONSTRAINT tab_user_pkey PRIMARY KEY (user_id),
  CONSTRAINT tab_user_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES auth.users(id)
);
```

**Campos Relevantes:**
- `user_id`: UUID do usuário (FK para auth.users)
- `user_role`: Role do usuário (pode ser `null`)
- Valores aceitos: `'free'`, `'pro'`, `'premium'`, `'admin'`, `'sadmin'`

### TypeScript Types

```typescript
// Types para user_role
type UserRole = 'free' | 'pro' | 'premium' | 'admin' | 'sadmin' | null;

// Interface para dados retornados do banco
interface UserRoleData {
  user_role: string | null;
}
```

## Error Handling

### Estratégia Fail-Safe

A solução adota uma abordagem **fail-safe** onde qualquer erro resulta em **negar acesso**:

1. **Se query falhar** → `getUserRole()` retorna `null`
2. **Se user_role for `null` no banco** → Tratado como sem permissões
3. **Se contexto não disponível** → Hook lança erro informativo
4. **Se ainda carregando** → Elementos protegidos permanecem ocultos

### Error Scenarios

| Cenário | Comportamento | Resultado UI |
|---------|---------------|--------------|
| Query falha | `getUserRole()` retorna `null` | Menu "Lab" oculto |
| user_role é `null` | Context armazena `null` | Menu "Lab" oculto |
| Usuário não autenticado | `userRole` é `null` | Menu "Lab" oculto |
| Role ainda carregando | `userRole` é `null` temporariamente | Menu "Lab" oculto |
| Role é `'sadmin'` | `userRole` é `'sadmin'` | Menu "Lab" visível |
| Role é outro valor | `userRole` é `'free'/'pro'/etc` | Menu "Lab" oculto |

### Error Logging

```typescript
// Logs apenas no console (desenvolvimento)
console.error('Error fetching user role:', error);

// Não bloqueia execução
// Não mostra erro para usuário final
// Aplicação continua funcionando normalmente
```

## Testing Strategy

### Unit Tests (Opcional - marcado como opcional nas tasks)

**Hook useUserRole:**
- Testa retorno correto quando role está disponível
- Testa retorno `null` quando não autenticado
- Testa erro quando usado fora do Provider

**Service getUserRole:**
- Testa query bem-sucedida
- Testa retorno `null` quando user_role é `null`
- Testa error handling

### Integration Tests (Opcional)

**AuthProvider + useUserRole:**
- Testa fluxo completo de login → busca role → disponibiliza no hook
- Testa logout → limpa role

### Manual Testing

**Casos de teste essenciais:**

1. **Usuário não autenticado**
   - Verificar: Menu "Lab" oculto

2. **Login com user_role = null**
   - Verificar: Menu "Lab" oculto

3. **Login com user_role = 'free'**
   - Verificar: Menu "Lab" oculto

4. **Login com user_role = 'sadmin'**
   - Verificar: Menu "Lab" visível

5. **Logout após ser sadmin**
   - Verificar: Menu "Lab" desaparece

6. **Navegação entre páginas (como sadmin)**
   - Verificar: Menu "Lab" permanece visível

## Performance Considerations

### Otimizações Implementadas

1. **Single Query on Login**
   - Role buscado apenas uma vez após autenticação
   - Armazenado em memória (React Context)
   - Sem queries adicionais durante navegação

2. **No Re-fetching**
   - Hook lê do Context (memória)
   - Não dispara queries ao banco
   - Re-renders são instantâneos

3. **Minimal Re-renders**
   - Apenas componentes usando `useUserRole()` re-renderizam
   - Outros componentes não são afetados

4. **Lazy Evaluation**
   - Query só executa após login bem-sucedido
   - Não executa para usuários não autenticados

### Performance Metrics (Expected)

- **Query time:** ~50-100ms (single row lookup)
- **Context read time:** <1ms (memória)
- **Re-render time:** <5ms (condicional simples)
- **Total overhead:** Imperceptível para usuário

## Security Considerations

### Frontend-Only Solution

**⚠️ Importante:** Esta é uma solução de **UI/UX**, não de segurança.

**O que esta solução faz:**
- ✅ Oculta elementos visuais baseado em role
- ✅ Melhora experiência do usuário
- ✅ Previne confusão (usuários não veem opções indisponíveis)

**O que esta solução NÃO faz:**
- ❌ Não protege rotas no backend
- ❌ Não impede chamadas API diretas
- ❌ Não substitui Row Level Security (RLS)

### Recomendações de Segurança

Para proteger funcionalidades administrativas de verdade:

1. **Implementar RLS no Supabase**
   ```sql
   CREATE POLICY "Only sadmin can access admin_data"
   ON admin_table
   FOR ALL
   USING (
     EXISTS (
       SELECT 1 FROM tab_user
       WHERE user_id = auth.uid()
       AND user_role = 'sadmin'
     )
   );
   ```

2. **Validar role em Edge Functions**
   ```typescript
   // Verificar role antes de executar ações sensíveis
   const { data: userData } = await supabase
     .from('tab_user')
     .select('user_role')
     .eq('user_id', userId)
     .single();
   
   if (userData?.user_role !== 'sadmin') {
     return new Response('Forbidden', { status: 403 });
   }
   ```

3. **Proteger rotas no backend**
   - Middleware de autenticação
   - Verificação de role em cada endpoint sensível

## Future Extensibility

### Fácil Expansão para Novos Casos

**Adicionar controle em outros componentes:**
```typescript
// Qualquer componente pode usar
const role = useUserRole();

// Exemplo: Botão premium
{(role === 'pro' || role === 'premium' || role === 'sadmin') && (
  <PremiumButton />
)}

// Exemplo: Painel admin
{role === 'sadmin' && <AdminPanel />}

// Exemplo: Badge de status
{role === 'admin' && <Badge>Admin</Badge>}
```

### Possível Evolução Futura (Sem Refatoração)

Se precisar de sistema mais complexo no futuro:

1. **Adicionar componente `<RoleGate>`**
   ```typescript
   <RoleGate allowedRoles={['sadmin', 'admin']}>
     <AdminFeature />
   </RoleGate>
   ```

2. **Adicionar hook `useHasRole()`**
   ```typescript
   const isAdmin = useHasRole(['admin', 'sadmin']);
   ```

3. **Adicionar permissões granulares**
   - Criar tabela `tab_permissions`
   - Estender Context com `permissions`
   - Hook `useCanAccess(feature)`

**Vantagem:** Arquitetura atual suporta essas expansões sem breaking changes.

## Implementation Notes

### Ordem de Implementação

1. **Primeiro:** Adicionar função `getUserRole()` em `services/supabase.ts`
2. **Segundo:** Estender `AuthProvider` para buscar e armazenar role
3. **Terceiro:** Criar hook `useUserRole()`
4. **Quarto:** Aplicar no `header.tsx`

### Compatibilidade com Código Existente

- ✅ Não quebra funcionalidades existentes
- ✅ AuthProvider mantém interface atual (apenas adiciona campo)
- ✅ Componentes existentes não são afetados
- ✅ Backward compatible

### Padrão Supabase Compliance

- ✅ Usa `@supabase/supabase-js` oficial
- ✅ Queries seguem padrão Supabase Client
- ✅ Error handling robusto
- ✅ Funções auxiliares em `services/supabase.ts`
- ✅ Integração com Supabase Auth
- ✅ Schema do banco respeitado
- ✅ Pronto para integração com RLS (futuro)

## Diagrams

### Sequence Diagram - Login with Role Fetch

```
User          AuthModal       AuthProvider    Supabase      Database
 |                |                |              |             |
 |-- Submit ----->|                |              |             |
 |                |-- login() ---->|              |             |
 |                |                |-- signIn --->|             |
 |                |                |              |-- Auth ---->|
 |                |                |              |<-- User ----|
 |                |                |<-- Session --|             |
 |                |                |              |             |
 |                |                |-- getUserRole(userId) ---->|
 |                |                |              |-- SELECT -->|
 |                |                |              |<-- role ----|
 |                |                |<-- 'sadmin' --|             |
 |                |                |              |             |
 |                |                |-- setState(userRole) --    |
 |                |<-- Success ----|              |             |
 |<-- Redirect ---|                |              |             |
 |                                 |              |             |
 |-- Navigate to App               |              |             |
 |                                 |              |             |
Header                             |              |             |
 |-- useUserRole() --------------->|              |             |
 |<-- 'sadmin' --------------------|              |             |
 |                                 |              |             |
 |-- Render Lab Menu               |              |             |
```

### Component Dependency Graph

```
AuthProvider (Context)
    ↓
    ├─→ useUserRole (Hook)
    │       ↓
    │       ├─→ header.tsx
    │       ├─→ [Future Component A]
    │       └─→ [Future Component B]
    │
    └─→ getUserRole (Service)
            ↓
        Supabase Client
            ↓
        tab_user (Database)
```

---

## Summary

Esta solução fornece um sistema minimalista, performático e reutilizável para controle de visibilidade de UI baseado em `user_role`. Segue rigorosamente o padrão Supabase, mantém compatibilidade com código existente, e permite fácil expansão futura sem refatoração significativa.

A implementação é direta, com apenas 4 arquivos modificados/criados, e resolve o caso de uso imediato (menu "Lab" para sadmin) enquanto estabelece um padrão reutilizável para toda a aplicação.
