# Plano de Migração: ChatPage para Padrão Supabase

## 🎯 Objetivo
Migrar ChatPage para usar dados do AuthProvider (fonte única) seguindo padrão oficial Supabase.

---

## 📊 SITUAÇÃO ATUAL (Problemática)

### ChatPage usa estado local independente:
```typescript
const [chats, setChats] = useState<Chat[]>([])
const [messages, setMessages] = useState<Message[]>([])
const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
```

### Múltiplos sistemas de storage:
- `localStorage['dante_chat_data']` - Sistema unificado
- `localStorage['user_chat_data']` - Sistema histórico
- Estado React local

### Problemas:
1. ❌ Não usa `profile` do AuthProvider
2. ❌ Carrega dados do localStorage diretamente
3. ❌ Não sincroniza com AuthProvider
4. ❌ Dados podem ficar desatualizados

---

## ✅ SITUAÇÃO DESEJADA (Padrão Supabase)

### ChatPage usa dados do AuthProvider:
```typescript
const { user, profile, loading } = useAuth()

// Carrega dados do Supabase quando necessário
useEffect(() => {
  if (user && !loading) {
    loadChatSessions()
  }
}, [user, loading])
```

### Fonte única de verdade:
- AuthProvider gerencia `user` e `profile`
- ChatPage carrega dados do Supabase via `chatService`
- localStorage usado apenas como cache (opcional)

### Benefícios:
1. ✅ Dados sempre atualizados
2. ✅ Sincronização automática
3. ✅ Menos código duplicado
4. ✅ Mais confiável

---

## 🔄 ESTRATÉGIA DE MIGRAÇÃO

### Fase 3A: Preparação (Não quebra nada)
1. Adicionar `chatService` functions no supabase.ts ✅ FEITO
2. Manter código atual funcionando
3. Adicionar logs para debug

### Fase 3B: Migração Incremental
1. ChatPage passa a usar `user` e `profile` do AuthProvider
2. Carrega sessões do Supabase via `chatService.loadUserChatSessions()`
3. Mantém localStorage como cache (fallback)
4. Remove sistemas duplicados gradualmente

### Fase 3C: Limpeza
1. Remove `dante_chat_data` (duplicado)
2. Simplifica `user_chat_data` (apenas cache)
3. Remove código morto

---

## 📝 MUDANÇAS NECESSÁRIAS NO CHATPAGE

### 1. Usar AuthProvider
```typescript
// ANTES
const { user, loading } = useAuth()

// DEPOIS
const { user, profile, loading } = useAuth()
```

### 2. Carregar Dados do Supabase
```typescript
// NOVO: Carregar sessões quando usuário loga
useEffect(() => {
  if (user && !loading) {
    loadChatSessionsFromSupabase()
  }
}, [user, loading])

const loadChatSessionsFromSupabase = async () => {
  if (!user?.id) return
  
  const { data, error } = await chatService.loadUserChatSessions(user.id)
  
  if (data) {
    // Converter para formato do ChatPage
    const loadedChats = data.map(session => ({
      id: session.chat_session_id,
      title: session.chat_session_title,
      // ...
    }))
    setChats(loadedChats)
  }
}
```

### 3. Salvar Mensagens no Supabase
```typescript
// Após enviar mensagem
const result = await chatService.saveChatMessage({
  chat_session_id: sessionId,
  chat_session_title: title,
  msg_input: userMessage,
  msg_output: botResponse,
  user_id: user.id
})

if (result.success) {
  // Atualizar estado local
  setMessages(prev => [...prev, newMessage])
}
```

### 4. Usar localStorage Apenas como Cache
```typescript
// Salvar no localStorage DEPOIS de salvar no Supabase
if (result.success) {
  // Atualizar estado
  setMessages(prev => [...prev, newMessage])
  
  // Cache local (opcional)
  saveToLocalStorageCache({ chats, messages })
}
```

---

## ⚠️ PONTOS DE ATENÇÃO

### 1. Loading States
- Mostrar loading enquanto carrega do Supabase
- Não renderizar antes dos dados estarem prontos

### 2. Sincronização
- Sempre salvar no Supabase primeiro
- localStorage é apenas cache

### 3. Erros
- Tratar erros de rede gracefully
- Fallback para cache se API falhar

### 4. Performance
- Carregar apenas sessões recentes
- Lazy load de mensagens antigas
- Debounce em operações frequentes

---

## 🧪 TESTES NECESSÁRIOS

### Cenário 1: Login
1. Usuário faz login
2. AuthProvider carrega profile
3. ChatPage carrega sessões do Supabase
4. Dados aparecem imediatamente

### Cenário 2: Enviar Mensagem
1. Usuário envia mensagem
2. Salva no Supabase
3. Atualiza estado local
4. Mensagem aparece imediatamente

### Cenário 3: F5 (Reload)
1. Página recarrega
2. AuthProvider restaura sessão
3. ChatPage carrega dados do Supabase
4. Estado restaurado corretamente

### Cenário 4: Offline
1. Sem conexão
2. Usa cache do localStorage
3. Mostra aviso de offline
4. Sincroniza quando voltar online

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Preparação
- [x] AuthProvider revertido para padrão Supabase
- [x] supabase.ts com chatService functions
- [ ] Backup do ChatPage atual
- [ ] Testes do AuthProvider

### Migração ChatPage
- [ ] Usar `profile` do AuthProvider
- [ ] Carregar sessões do Supabase
- [ ] Carregar mensagens do Supabase
- [ ] Salvar mensagens no Supabase
- [ ] localStorage como cache apenas

### Limpeza
- [ ] Remover `dante_chat_data`
- [ ] Simplificar `user_chat_data`
- [ ] Remover código duplicado
- [ ] Atualizar documentação

### Testes
- [ ] Login → Dados aparecem
- [ ] Enviar mensagem → Persiste
- [ ] F5 → Mantém estado
- [ ] Offline → Usa cache

---

## 🚀 PRÓXIMOS PASSOS

**AGUARDANDO APROVAÇÃO:**

1. Testar AuthProvider revertido
2. Verificar se login funciona
3. Confirmar que não quebrou nada
4. Prosseguir com migração do ChatPage

**Posso prosseguir com os testes?**
