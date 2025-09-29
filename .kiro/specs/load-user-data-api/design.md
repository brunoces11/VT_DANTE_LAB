# Design Document

## Overview

A Edge Function `load_user_data` será implementada como uma função Deno que consulta o banco PostgreSQL do Supabase para carregar dados completos do usuário autenticado, incluindo sessões de chat e mensagens.

## Architecture

### Function Structure
```
supabase/functions/load_user_data/
└── index.ts
```

### Request Flow
1. Frontend → POST `/functions/v1/load_user_data`
2. Validar autenticação JWT
3. Extrair `user_id` do token
4. Consultar `tab_chat_session`
5. Para cada sessão, consultar `tab_chat_msg`
6. Estruturar resposta JSON
7. Retornar dados ao frontend

## Components and Interfaces

### HTTP Interface
- **Method**: POST
- **Endpoint**: `/functions/v1/load_user_data`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**: Vazio (dados vêm do token JWT)

### Response Interface
```typescript
interface LoadUserDataResponse {
  user_id: string;
  chat_sessions: ChatSession[];
}

interface ChatSession {
  chat_session_id: string;
  chat_session_title: string;
  messages: ChatMessage[];
}

interface ChatMessage {
  chat_msg_id: string;
  msg_input: string;
  msg_output: string;
}
```

## Data Models

### Database Queries

#### Query 1: Buscar Sessões
```sql
SELECT chat_session_id, chat_session_title 
FROM public.tab_chat_session 
WHERE user_id = $1
ORDER BY session_time DESC
```

#### Query 2: Buscar Mensagens por Sessão
```sql
SELECT chat_msg_id, msg_input, msg_output 
FROM public.tab_chat_msg 
WHERE chat_session_id = $1 AND user_id = $2
ORDER BY msg_time ASC
```

### Authentication Flow
```typescript
const authHeader = req.headers.get('authorization')
const token = authHeader?.replace('Bearer ', '')
const { data: { user } } = await supabase.auth.getUser(token)
const user_id = user?.id
```

## Error Handling

### Error Types
- **401 Unauthorized**: Token inválido ou ausente
- **500 Internal Server Error**: Erro de banco ou processamento
- **200 OK**: Sucesso com dados ou arrays vazios

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Testing Strategy

### Unit Tests
- Validação de autenticação
- Queries de banco de dados
- Estruturação da resposta JSON
- Tratamento de erros

### Integration Tests
- Teste end-to-end com dados reais
- Teste com usuário sem sessões
- Teste com sessões sem mensagens
- Teste de performance com múltiplas sessões

### Test Data Setup
```sql
-- Usuário de teste
INSERT INTO public.tab_user (user_id, user_name) VALUES ('test-uuid', 'Test User');

-- Sessão de teste
INSERT INTO public.tab_chat_session (chat_session_id, user_id, chat_session_title) 
VALUES ('session-uuid', 'test-uuid', 'Test Session');

-- Mensagens de teste
INSERT INTO public.tab_chat_msg (chat_msg_id, chat_session_id, user_id, msg_input, msg_output)
VALUES ('msg-uuid-1', 'session-uuid', 'test-uuid', 'Hello', 'Hi there!');
```