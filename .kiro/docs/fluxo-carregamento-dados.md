# Fluxo de Carregamento de Dados - VT_DANTE

## 🔄 Sequência Completa (Login → Exibição)

### **ETAPA 1: Login do Usuário**
```
Usuário faz login → AuthProvider.login()
  ↓
Supabase Auth valida credenciais
  ↓
Token JWT gerado e armazenado
  ↓
Navegação para /chat
```

### **ETAPA 2: Inicialização do ChatPage**
```
ChatPage.tsx carrega
  ↓
useEffect detecta user?.id
  ↓
Chama loadChatData()
```

### **ETAPA 3: Carregamento de Dados**
```
loadChatData() {
  
  1. Verifica cache local (UX rápida)
     ↓
     loadSafeCache() → se existe, exibe temporariamente
  
  2. Busca dados frescos do servidor
     ↓
     fun_load_user_data() → chama edge function
     ↓
     Edge Function: load_user_data/index.ts
       - Valida token JWT
       - Query: SELECT * FROM tab_chat_session WHERE user_id = ?
       - Query: SELECT * FROM tab_chat_msg WHERE chat_session_id = ?
       - Retorna JSON estruturado
     ↓
     Retorna para ChatPage
  
  3. Processa e atualiza UI
     ↓
     updateUIWithServerData(serverData.data)
       - Transforma chat_sessions em formato UI
       - setChats(serverChats) → atualiza sidebar
       - Carrega primeira sessão automaticamente
       - fun_load_chat_session(firstSession.id)
  
  4. Salva cache atualizado
     ↓
     saveSafeCache(safeCacheData)
}
```

### **ETAPA 4: Exibição na UI**
```
Sidebar:
  - Lista de sessões (chats)
  - Títulos das conversas
  - Última mensagem preview

Chat Area:
  - Mensagens da sessão ativa
  - Input para nova mensagem
```

## 🔗 Relacionamento das Funções

### **COMPLEMENTARES (Trabalham Juntas)**

```
fun_load_user_data()          updateUIWithServerData()
       ↓                              ↓
   [BACKEND]                      [FRONTEND]
       ↓                              ↓
  Busca dados                  Processa dados
       ↓                              ↓
  Retorna JSON      →→→→→→→→→  Atualiza UI
```

### **Analogia Simples**

```
fun_load_user_data = "Garçom que busca o pedido na cozinha"
  - Vai até o backend
  - Pega os dados
  - Traz de volta

updateUIWithServerData = "Chef que prepara e serve o prato"
  - Recebe os ingredientes (dados brutos)
  - Processa e formata
  - Serve na mesa (UI)
```

## 📊 Formato dos Dados

### **Dados do Servidor (fun_load_user_data)**
```json
{
  "user_id": "abc-123",
  "chat_sessions": [
    {
      "chat_session_id": "session-1",
      "chat_session_title": "Consulta sobre registro",
      "messages": [
        {
          "chat_msg_id": "msg-1",
          "msg_input": "Como fazer registro?",
          "msg_output": "Para fazer registro..."
        }
      ]
    }
  ]
}
```

### **Dados da UI (updateUIWithServerData)**
```typescript
[
  {
    id: "session-1",
    title: "Consulta sobre registro",
    lastMessage: "Para fazer registro...",
    timestamp: "2024-01-15 10:30",
    isEmpty: false,
    isActive: true,
    message_count: 1
  }
]
```

## ⚠️ Problemas Comuns

### **1. Dados não carregam**
```
Verificar:
- Edge function deployada?
- Token válido?
- Usuário tem sessões no banco?
- Console mostra erros?
```

### **2. Sidebar vazia**
```
Verificar:
- serverData.data.chat_sessions existe?
- updateUIWithServerData foi chamada?
- setChats() atualizou o estado?
```

### **3. Mensagens não aparecem**
```
Verificar:
- fun_load_chat_session() foi chamada?
- Sessão tem mensagens?
- Estado messages foi atualizado?
```

## ✅ Checklist de Funcionamento

- [ ] Login bem-sucedido
- [ ] Token JWT válido
- [ ] fun_load_user_data() chamada
- [ ] Edge function retorna dados
- [ ] updateUIWithServerData() processa
- [ ] Sidebar mostra sessões
- [ ] Primeira sessão carregada
- [ ] Mensagens exibidas
