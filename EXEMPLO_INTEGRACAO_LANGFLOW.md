# 🚀 EXEMPLO DE INTEGRAÇÃO - fun_dante_ri_langflow

## 📋 COMO USAR A NOVA FUNÇÃO:

### **1. Import no ChatPage.tsx:**
```typescript
import { fun_dante_ri_langflow } from '../../services/langflow';
```

### **2. Substituir a lógica atual:**

#### **ANTES (simulação):**
```typescript
// Simular resposta da IA
const totalLoadingTime = loadingSequence.reduce((sum, step) => sum + step.delay, 0);
setTimeout(() => {
  const responses = [...]; // Respostas hardcoded
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Adicionar resposta
  setMessages(prev => [...]);
  
  // Salvar no banco separadamente
  fun_save_chat_data({...});
}, totalLoadingTime);
```

#### **DEPOIS (Langflow real):**
```typescript
// Usar Langflow real + salvamento automático
const totalLoadingTime = loadingSequence.reduce((sum, step) => sum + step.delay, 0);
setTimeout(async () => {
  try {
    // Chamar Langflow + salvar automaticamente
    const result = await fun_dante_ri_langflow({
      chat_session_id: newSessionId,
      chat_session_title: inputValue.length > 50 ? inputValue.substring(0, 50) + '...' : inputValue,
      msg_input: inputValue,
      user_id: user.id
    });

    if (result.success) {
      // Remover loading e adicionar resposta real do Langflow
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, {
          id: Date.now() + 2,
          content: result.data.langflow_response, // ← Resposta real do Langflow
          sender: 'bot',
          timestamp: getCurrentTimestampUTC(),
        }];
      });

      console.log('✅ Langflow + Banco: Sucesso completo');
      if (result.data.save_status) {
        console.log('💾 Chat salvo no banco automaticamente');
      } else {
        console.warn('⚠️ Langflow OK, mas falha no banco:', result.data.save_error);
      }
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Erro no Langflow:', error);
    
    // Fallback: usar resposta de erro
    setMessages(prev => {
      const withoutLoading = prev.filter(msg => !msg.isLoading);
      return [...withoutLoading, {
        id: Date.now() + 2,
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'bot',
        timestamp: getCurrentTimestampUTC(),
      }];
    });
  } finally {
    setIsLoading(false);
  }
}, totalLoadingTime);
```

## 🎯 VANTAGENS DA NOVA FUNÇÃO:

### **✅ Integração Completa:**
- ✅ Envia para Langflow real
- ✅ Usa chat_session_id correto
- ✅ Salva automaticamente no banco
- ✅ Tratamento de erros robusto

### **✅ Fluxo Automatizado:**
```
1. Usuário envia mensagem
2. fun_dante_ri_langflow() é chamada
3. Envia para Langflow com session_id
4. Recebe resposta tratada
5. Automaticamente chama ef_save_chat
6. Retorna resposta + status do salvamento
```

### **✅ Logs Detalhados:**
```
🚀 Enviando mensagem para Langflow...
📡 Fazendo requisição para Langflow: https://lf142.prompt-master.org/api/v1/run/1060b727...
📥 Resposta bruta do Langflow: {...}
✅ Resposta tratada do Langflow: "Resposta da IA..."
💾 Salvando conversa no banco automaticamente...
✅ Conversa salva no banco com sucesso
```

## 🔧 PARÂMETROS DA FUNÇÃO:

```typescript
interface DanteRiParams {
  chat_session_id: string;    // UUID gerado pelo React
  chat_session_title: string; // Título da sessão (primeiros 50 chars)
  msg_input: string;          // Pergunta do usuário
  user_id: string;           // ID do usuário logado
}
```

## 📊 RETORNO DA FUNÇÃO:

```typescript
{
  success: boolean;
  data: {
    langflow_response: string;    // Resposta tratada do Langflow
    raw_response: object;         // Resposta bruta para debug
    save_status: boolean;         // Se salvou no banco
    save_error: string | null;    // Erro do salvamento (se houver)
  } | null;
  error: string | null;
}
```

## 🚀 PRÓXIMO PASSO:

**Integrar no ChatPage.tsx substituindo a simulação pela função real!**