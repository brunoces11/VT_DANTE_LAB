# Design Document - Sistema Multi-Agente

## Overview

Este documento detalha o design técnico para implementação do sistema multi-agente no VT_DANTE. O sistema permitirá que usuários escolham entre diferentes especialistas de IA (Registro de Imóveis, Tabelionato de Notas, etc.) através de dois fluxos distintos de entrada, mantendo persistência e contexto por sessão.

### Objetivos do Design

1. **Arquitetura Escalável**: Adicionar novos agentes sem refatoração massiva
2. **Separação de Responsabilidades**: Componentes únicos parametrizados
3. **Persistência Robusta**: Manter contexto de agente por sessão
4. **UX Consistente**: Fluxos claros e feedback visual adequado
5. **Compatibilidade**: Manter sistema existente funcionando (fallback para chats antigos)

### Princípios de Design

- **Single Source of Truth**: Configurações centralizadas em `agentConfigs.ts`
- **Composition over Duplication**: Componente único parametrizado vs. múltiplos componentes
- **Progressive Enhancement**: Sistema funciona mesmo se um agente estiver indisponível
- **Padrão Supabase**: Seguir convenções de autenticação, edge functions e cache

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Header     │    │  ChatPage    │    │  Sidebar     │  │
│  │ "Iniciar     │───▶│  (Estado     │◀───│  (2 botões   │  │
│  │  Chat"       │    │   Central)   │    │   Novo Chat) │  │
│  └──────────────┘    └──────┬───────┘    └──────────────┘  │
│                              │                               │
│                              ▼                               │
│                    ┌─────────────────┐                      │
│                    │  WelcomeChat    │                      │
│                    │  (Seletor de    │                      │
│                    │   Agente)       │                      │
│                    └────────┬────────┘                      │
│                             │                               │
│                             ▼                               │
│                    ┌─────────────────┐                      │
│                    │  ChatNeoMsg     │                      │
│                    │  (Parametrizado)│                      │
│                    └────────┬────────┘                      │
│                             │                               │
│                             ▼                               │
│                    ┌─────────────────┐                      │
│                    │  ChatArea       │                      │
│                    │  (Conversa)     │                      │
│                    └─────────────────┘                      │
│                                                              │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  langflow.ts     │         │  supabase.ts     │         │
│  │  - Roteamento    │         │  - Salvamento    │         │
│  │    por agente    │         │  - Carregamento  │         │
│  │  - Flow IDs      │         │  - Cache         │         │
│  └────────┬─────────┘         └────────┬─────────┘         │
│           │                            │                    │
└───────────┼────────────────────────────┼────────────────────┘
            │                            │
            ▼                            ▼
┌─────────────────────┐      ┌─────────────────────┐
│   LANGFLOW APIs     │      │   SUPABASE DB       │
│  - dante-ri         │      │  - tab_chat_session │
│  - dante-notas      │      │  - tab_chat_msg     │
└─────────────────────┘      └─────────────────────┘
```


### Data Flow - Fluxo 1: Usuário vem do Site

```
1. Usuário em HomePage/QuemSomos/etc
   ↓
2. Clica "Iniciar Chat" no Header
   ↓
3. navigate('/chat', { state: { startWelcome: true } })
   ↓
4. ChatPage detecta state.startWelcome
   ↓
5. setIsWelcomeForced(true) + persistUIState(null, true)
   ↓
6. Renderiza WelcomeChat (seletor de agente)
   ↓
7. Usuário clica em card (RI ou NOTAS)
   ↓
8. setCurrentAgentType('dante-ri' | 'dante-notas')
   ↓
9. Renderiza ChatNeoMsg com agentConfig correspondente
   ↓
10. Usuário digita e envia primeira mensagem
    ↓
11. handleFirstMessage(inputValue)
    ↓
12. fun_call_langflow({ agent_type: currentAgentType })
    ↓
13. saveInBackground({ agent_type: currentAgentType })
    ↓
14. Sessão salva no banco com agent_type
```

### Data Flow - Fluxo 2: Usuário já no Chat

```
1. Usuário já em /chat
   ↓
2. Clica "Novo Chat - RI" ou "Novo Chat - NOTAS" no Sidebar
   ↓
3. fun_create_chat_session('dante-ri' | 'dante-notas')
   ↓
4. setCurrentAgentType(agentType)
   ↓
5. setIsWelcomeMode(true)
   ↓
6. Renderiza ChatNeoMsg com agentConfig correspondente
   ↓
7. [Fluxo continua igual ao Fluxo 1 a partir do passo 10]
```

### Data Flow - Fluxo 3: Carregar Chat Antigo

```
1. Usuário clica em chat antigo no Sidebar
   ↓
2. fun_load_chat_session(sessionId)
   ↓
3. Busca sessão em serverData.chat_sessions
   ↓
4. Extrai agent_type da sessão (ou 'dante-ri' como fallback)
   ↓
5. setCurrentAgentType(agent_type)
   ↓
6. Carrega mensagens da sessão
   ↓
7. setIsWelcomeMode(false)
   ↓
8. Renderiza ChatArea com mensagens
   ↓
9. Novas mensagens usam currentAgentType para:
   - fun_call_langflow({ agent_type: currentAgentType })
   - saveInBackground({ agent_type: currentAgentType })
```

## Components and Interfaces

### 1. WelcomeChat (NOVO)

**Responsabilidade**: Seletor inicial de agente quando usuário vem de fora do chat

**Props**:
```typescript
interface WelcomeChatProps {
  onAgentSelect: (agentType: AgentType) => void;
}
```

**Estado Interno**: Nenhum (stateless)

**Estrutura Visual**:
```
┌────────────────────────────────────────────┐
│        Seja bem-vindo ao Dante             │
│                                            │
│  Escolha qual especialista você deseja     │
│  consultar para suas dúvidas...            │
│                                            │
│  ┌──────────────────┐  ┌──────────────────┐│
│  │ 📋 Registro de   │  │ 📝 Tabelionato   ││
│  │    Imóveis       │  │    de Notas      ││
│  │                  │  │                  ││
│  │ Especialista em  │  │ Especialista em  ││
│  │ registro de      │  │ reconhecimento   ││
│  │ propriedades...  │  │ de firmas...     ││
│  │                  │  │                  ││
│  │ [Iniciar Chat] → │  │ [Iniciar Chat] → ││
│  └──────────────────┘  └──────────────────┘│
└────────────────────────────────────────────┘
```

**Comportamento**:
- Renderiza cards dinamicamente baseado em `agentConfigs`
- Ao clicar em card, chama `onAgentSelect(agentType)`
- Hover states e feedback visual
- Responsivo (grid 1 coluna em mobile, 2 em desktop)


### 2. ChatNeoMsg (MODIFICADO)

**Responsabilidade**: Tela de boas-vindas parametrizada por agente

**Props Atuais**:
```typescript
interface ChatNeoMsgProps {
  onFirstMessage: (message: string) => void;
  isLoading: boolean;
}
```

**Props Novas**:
```typescript
interface ChatNeoMsgProps {
  onFirstMessage: (message: string) => void;
  isLoading: boolean;
  agentType: AgentType; // ✅ NOVO
}
```

**Mudanças Necessárias**:
1. Receber prop `agentType`
2. Carregar config de `agentConfigs[agentType]`
3. Renderizar dinamicamente:
   - Título (ex: "Especialista em Registro de Imóveis")
   - Descrição
   - Sugestões (cards clicáveis)
   - Placeholder do input
   - Ícone/cor do agente

**Estrutura de Dados**:
```typescript
interface AgentConfig {
  id: AgentType;
  title: string;
  description: string;
  icon: string;
  color: string;
  suggestions: Array<{
    title: string;
    description: string;
    prompt: string;
  }>;
  placeholder: string;
}
```

### 3. agentConfigs.ts (NOVO)

**Localização**: `src/config/agentConfigs.ts`

**Estrutura**:
```typescript
export type AgentType = 'dante-ri' | 'dante-notas';

export const agentConfigs: Record<AgentType, AgentConfig> = {
  'dante-ri': {
    id: 'dante-ri',
    title: 'Especialista em Registro de Imóveis',
    description: 'Seu assistente especializado em Registro de Imóveis. Faça sua pergunta sobre procedimentos registrais, legislação vigente ou qualificação de títulos.',
    icon: '📋',
    color: 'orange',
    suggestions: [
      {
        title: '📋 Procedimentos Registrais',
        description: 'Orientações sobre registro de títulos e documentos',
        prompt: 'Como fazer o registro de uma escritura de compra e venda?'
      },
      {
        title: '📄 Documentação',
        description: 'Documentos exigidos e qualificação registral',
        prompt: 'Quais são os documentos necessários para registro de imóvel?'
      },
      {
        title: '💰 Emolumentos',
        description: 'Cálculo de taxas e tributos registrais',
        prompt: 'Como calcular emolumentos para registro de imóvel?'
      },
      {
        title: '⚖️ Legislação',
        description: 'Lei 6.015/73 e normas do CNJ',
        prompt: 'Qual a legislação aplicável ao registro de imóveis?'
      }
    ],
    placeholder: 'Digite sua pergunta sobre Registro de Imóveis...'
  },
  'dante-notas': {
    id: 'dante-notas',
    title: 'Especialista em Tabelionato de Notas',
    description: 'Seu assistente especializado em Tabelionato de Notas. Faça sua pergunta sobre reconhecimento de firmas, autenticações e escrituras públicas.',
    icon: '📝',
    color: 'blue',
    suggestions: [
      {
        title: '✍️ Reconhecimento de Firma',
        description: 'Procedimentos e tipos de reconhecimento',
        prompt: 'Como funciona o reconhecimento de firma por autenticidade?'
      },
      {
        title: '📜 Escrituras Públicas',
        description: 'Lavratura e requisitos legais',
        prompt: 'Quais documentos são necessários para lavrar uma escritura?'
      },
      {
        title: '🔐 Autenticações',
        description: 'Cópias autenticadas e procedimentos',
        prompt: 'Como autenticar documentos no tabelionato?'
      },
      {
        title: '⚖️ Legislação',
        description: 'Lei 8.935/94 e normas do CNJ',
        prompt: 'Qual a legislação aplicável ao tabelionato de notas?'
      }
    ],
    placeholder: 'Digite sua pergunta sobre Tabelionato de Notas...'
  }
};

// Helper para validação
export function isValidAgentType(type: string): type is AgentType {
  return type in agentConfigs;
}

// Helper para obter lista de agentes
export function getAvailableAgents(): AgentType[] {
  return Object.keys(agentConfigs) as AgentType[];
}
```

### 4. ChatPage (MODIFICADO)

**Estado Novo**:
```typescript
const [currentAgentType, setCurrentAgentType] = useState<AgentType>('dante-ri');
const [showWelcomeChat, setShowWelcomeChat] = useState(false);
```

**Funções Modificadas**:

**fun_create_chat_session**:
```typescript
// ANTES
const fun_create_chat_session = () => {
  setCurrentSessionId(null);
  setMessages([]);
  setIsWelcomeMode(true);
  setIsWelcomeForced(true);
  persistUIState(null, true);
};

// DEPOIS
const fun_create_chat_session = (agentType: AgentType) => {
  console.log(`🆕 Criando nova sessão - Agente: ${agentType}`);
  setCurrentSessionId(null);
  setMessages([]);
  setIsWelcomeMode(true);
  setIsWelcomeForced(true);
  setCurrentAgentType(agentType); // ✅ NOVO
  persistUIState(null, true);
};
```

**fun_load_chat_session**:
```typescript
const fun_load_chat_session = (sessionId: string) => {
  try {
    const serverData = (window as any).__serverData;
    if (serverData?.chat_sessions) {
      const serverSession = serverData.chat_sessions.find(
        (s: any) => s.chat_session_id === sessionId
      );
      
      // ✅ NOVO: Carregar agent_type
      const chatAgentType = serverSession?.agent_type || 'dante-ri';
      setCurrentAgentType(chatAgentType);
      console.log(`🤖 Chat carregado com agente: ${chatAgentType}`);
      
      // ... resto do código de carregamento
    }
  } catch (error) {
    console.error('❌ Erro ao carregar sessão:', error);
  }
};
```

**handleFirstMessage**:
```typescript
const handleFirstMessage = async (inputValue: string) => {
  // ... código existente ...
  
  // ✅ MODIFICAR: Incluir agent_type na chamada Langflow
  const langflowResult = await fun_call_langflow({
    input_value: inputValue,
    session_id: newSessionId,
    agent_type: currentAgentType // ✅ NOVO
  });
  
  // ✅ MODIFICAR: Incluir agent_type no salvamento
  const saveData = {
    chat_session_id: newSessionId,
    chat_session_title: inputValue.substring(0, 50),
    msg_input: inputValue,
    msg_output: treatedResponse,
    user_id: user.id,
    agent_type: currentAgentType // ✅ NOVO
  };
  
  saveInBackground(saveData, updateMessageStatus, userMessage.id);
};
```

**Lógica de Renderização**:
```typescript
// Detectar se deve mostrar WelcomeChat
useEffect(() => {
  const state = location.state as { startWelcome?: boolean } | null;
  if (state?.startWelcome) {
    setShowWelcomeChat(true);
    setIsWelcomeForced(true);
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location.state]);

// No JSX
{showWelcomeChat ? (
  <WelcomeChat 
    onAgentSelect={(agentType) => {
      setCurrentAgentType(agentType);
      setShowWelcomeChat(false);
      setIsWelcomeMode(true);
    }}
  />
) : (
  <ChatArea 
    // ... props existentes
    currentAgentType={currentAgentType} // ✅ NOVO
  />
)}
```


### 5. SidebarCollapse (MODIFICADO)

**Props Modificadas**:
```typescript
// ANTES
interface SidebarCollapseProps {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  onChatClick: (sessionId: string) => void;
  onNewChat: () => void; // ❌ ANTIGO
  currentSessionId: string | null;
}

// DEPOIS
interface SidebarCollapseProps {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  onChatClick: (sessionId: string) => void;
  onNewChat: (agentType: AgentType) => void; // ✅ NOVO
  currentSessionId: string | null;
}
```

**UI Modificada**:
```typescript
// ANTES
<Button onClick={handleNewChat}>
  <Home className="h-4 w-4" />
  <span>Novo Chat</span>
</Button>

// DEPOIS
<div className="flex flex-col gap-2">
  <Button 
    onClick={() => onNewChat('dante-ri')}
    className="w-full bg-orange-500 hover:bg-orange-600"
  >
    <Home className="h-4 w-4" />
    <span>Novo Chat - RI</span>
  </Button>
  
  <Button 
    onClick={() => onNewChat('dante-notas')}
    className="w-full bg-blue-500 hover:bg-blue-600"
  >
    <Home className="h-4 w-4" />
    <span>Novo Chat - NOTAS</span>
  </Button>
</div>
```

**Versão Colapsada**:
```typescript
{isCollapsed ? (
  <>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={() => onNewChat('dante-ri')}>
          📋
        </Button>
      </TooltipTrigger>
      <TooltipContent>Novo Chat - RI</TooltipContent>
    </Tooltip>
    
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={() => onNewChat('dante-notas')}>
          📝
        </Button>
      </TooltipTrigger>
      <TooltipContent>Novo Chat - NOTAS</TooltipContent>
    </Tooltip>
  </>
) : (
  // Versão expandida acima
)}
```

### 6. ChatArea (MODIFICADO)

**Props Modificadas**:
```typescript
// ANTES
interface ChatAreaProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isWelcomeMode: boolean;
  onFirstMessage: (message: string) => void;
  currentSessionId: string | null;
}

// DEPOIS
interface ChatAreaProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isWelcomeMode: boolean;
  onFirstMessage: (message: string) => void;
  currentSessionId: string | null;
  currentAgentType: AgentType; // ✅ NOVO
}
```

**handleSendMessage Modificado**:
```typescript
const handleSendMessage = async (inputValue: string) => {
  // ... código existente ...
  
  // ✅ MODIFICAR: Incluir agent_type
  const langflowResult = await fun_call_langflow({
    input_value: inputValue,
    session_id: currentSessionId,
    agent_type: currentAgentType // ✅ NOVO
  });
  
  // ✅ MODIFICAR: Incluir agent_type no salvamento
  const saveData = {
    chat_session_id: currentSessionId,
    chat_session_title: 'Conversa existente',
    msg_input: inputValue,
    msg_output: treatedResponse,
    user_id: user.id,
    agent_type: currentAgentType // ✅ NOVO
  };
  
  saveInBackground(saveData, updateMessageStatus, userMessage.id);
};
```

**Renderização Modificada**:
```typescript
{isWelcomeMode ? (
  <ChatNeoMsg 
    onFirstMessage={onFirstMessage}
    isLoading={isLoading}
    agentType={currentAgentType} // ✅ NOVO
  />
) : (
  <>
    <ChatMsgList messages={messages} />
    <ChatInputMsg onSendMessage={handleSendMessage} />
  </>
)}
```

### 7. fun_call_langflow (MODIFICADO)

**Localização**: `services/langflow.ts`

**Assinatura Modificada**:
```typescript
// ANTES
export async function fun_call_langflow(params: {
  input_value: string;
  session_id: string;
}): Promise<{ success: boolean; response?: string; error?: string }>

// DEPOIS
export async function fun_call_langflow(params: {
  input_value: string;
  session_id: string;
  agent_type?: AgentType; // ✅ NOVO (opcional, default 'dante-ri')
}): Promise<{ success: boolean; response?: string; error?: string }>
```

**Lógica de Roteamento**:
```typescript
export async function fun_call_langflow(params: {
  input_value: string;
  session_id: string;
  agent_type?: AgentType;
}): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    // ✅ NOVO: Determinar qual agente usar
    const agentType = params.agent_type || 'dante-ri';
    console.log(`🤖 Usando agente: ${agentType}`);
    
    // ✅ NOVO: Selecionar Flow ID baseado no agente
    const langflowUrl = import.meta.env.VITE_LANGFLOW_URL;
    const langflowFlowId = agentType === 'dante-notas' 
      ? import.meta.env.VITE_LANGFLOW_FLOW_ID_NOTAS
      : import.meta.env.VITE_LANGFLOW_FLOW_ID_RI;
    
    console.log(`📡 Flow ID selecionado: ${langflowFlowId?.slice(0, 8)}...`);
    
    if (!langflowUrl || !langflowFlowId) {
      throw new Error(`Variáveis de ambiente do Langflow (${agentType}) não configuradas`);
    }
    
    // ... resto do código continua igual
    
    const fullUrl = langflowUrl.endsWith('/')
      ? `${langflowUrl}api/v1/run/${langflowFlowId}`
      : `${langflowUrl}/api/v1/run/${langflowFlowId}`;
    
    // ... fazer requisição normalmente
  } catch (error) {
    console.error('❌ Erro ao chamar Langflow:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}
```

### 8. saveInBackground (MODIFICADO)

**Localização**: `services/supabase.ts`

**Interface Modificada**:
```typescript
// ANTES
interface SaveChatData {
  chat_session_id: string;
  chat_session_title: string;
  msg_input: string;
  msg_output: string;
  user_id: string;
}

// DEPOIS
interface SaveChatData {
  chat_session_id: string;
  chat_session_title: string;
  msg_input: string;
  msg_output: string;
  user_id: string;
  agent_type?: AgentType; // ✅ NOVO (opcional)
}
```

**Nota**: A edge function `ef_save_chat` já está preparada para receber `agent_type` opcional, então apenas passar o campo é suficiente.

## Data Models

### AgentType

```typescript
export type AgentType = 'dante-ri' | 'dante-notas';
```

**Validação**:
- Valores permitidos: `'dante-ri'`, `'dante-notas'`
- Fallback padrão: `'dante-ri'`
- Validação no backend: Edge function valida valores permitidos

### AgentConfig

```typescript
interface AgentConfig {
  id: AgentType;
  title: string;
  description: string;
  icon: string;
  color: string;
  suggestions: Array<{
    title: string;
    description: string;
    prompt: string;
  }>;
  placeholder: string;
}
```

### Chat Session (Banco de Dados)

**Tabela**: `tab_chat_session`

**Colunas Existentes**:
- `chat_session_id` (UUID, PK)
- `user_id` (UUID, FK)
- `chat_session_title` (TEXT)
- `created_at` (TIMESTAMP)

**Coluna Nova**:
- `agent_type` (TEXT, nullable) ✅ JÁ EXISTE NO BANCO

**Constraints**:
- `agent_type` pode ser NULL (para compatibilidade com chats antigos)
- Valores válidos: `'dante-ri'`, `'dante-notas'` (validação na aplicação)

### Cache Structure

**SafeCache v2.0** (já implementado):
```typescript
interface SafeCache {
  user_id: string;
  sessions: Array<{
    id: string;
    title: string;
    message_count: number;
    last_updated: string;
    agent_type?: AgentType; // ✅ ADICIONAR
  }>;
  ui_state: {
    currentSessionId: string | null;
    isWelcomeMode: boolean;
  };
  version: string;
  last_sync: string;
}
```


## Error Handling

### 1. Variáveis de Ambiente Ausentes

**Cenário**: Flow ID de um agente não está configurado

**Tratamento**:
```typescript
if (!langflowFlowId) {
  console.error(`❌ Flow ID não configurado para agente: ${agentType}`);
  return {
    success: false,
    error: `Agente ${agentType} temporariamente indisponível. Tente outro agente.`
  };
}
```

**UX**: Exibir mensagem de erro amigável sugerindo usar outro agente

### 2. Agent Type Inválido

**Cenário**: agent_type recebido não é válido

**Tratamento**:
```typescript
if (agent_type && !isValidAgentType(agent_type)) {
  console.warn(`⚠️ Agent type inválido: ${agent_type}, usando fallback`);
  agent_type = 'dante-ri';
}
```

**UX**: Usar fallback silenciosamente, registrar warning no console

### 3. Falha na Chamada Langflow

**Cenário**: API do Langflow retorna erro

**Tratamento**:
```typescript
catch (error) {
  console.error('❌ Erro no Langflow:', error);
  
  // Mensagem de erro amigável
  const errorMessage = `## ⚠️ Erro Temporário\n\n` +
    `Desculpe, o agente ${agentConfigs[agentType].title} está ` +
    `temporariamente indisponível.\n\n` +
    `**Tente novamente em alguns instantes** ou escolha outro agente.`;
  
  return {
    success: false,
    error: errorMessage
  };
}
```

**UX**: Exibir mensagem formatada no chat, permitir retry

### 4. Sessão Antiga sem agent_type

**Cenário**: Usuário carrega chat antigo que não tem agent_type

**Tratamento**:
```typescript
const chatAgentType = serverSession?.agent_type || 'dante-ri';
console.log(`🔄 Chat antigo sem agent_type, usando fallback: ${chatAgentType}`);
setCurrentAgentType(chatAgentType);
```

**UX**: Funciona normalmente com fallback, sem notificação ao usuário

### 5. Edge Function Validation Error

**Cenário**: Backend rejeita agent_type inválido

**Tratamento**:
```typescript
// No backend (ef_save_chat)
if (agent_type && !['dante-ri', 'dante-notas'].includes(agent_type)) {
  return new Response(JSON.stringify({ 
    error: 'agent_type inválido',
    received: agent_type
  }), { status: 400 });
}
```

**UX**: Retry automático com fallback 'dante-ri'

## Testing Strategy

### Unit Tests

**Arquivos a testar**:
1. `agentConfigs.ts`
   - Validação de tipos
   - Helpers (isValidAgentType, getAvailableAgents)
   - Estrutura de dados

2. `langflow.ts`
   - Roteamento correto de Flow IDs
   - Fallback para 'dante-ri'
   - Tratamento de erros

### Integration Tests

**Fluxos a testar**:
1. **Fluxo 1 - Site → WelcomeChat → Chat**
   - Navegação do Header
   - Seleção de agente
   - Primeira mensagem
   - Salvamento com agent_type

2. **Fluxo 2 - Sidebar → Chat**
   - Clique em "Novo Chat - RI"
   - Clique em "Novo Chat - NOTAS"
   - Primeira mensagem
   - Salvamento com agent_type

3. **Fluxo 3 - Carregar Chat Antigo**
   - Carregar chat com agent_type
   - Carregar chat sem agent_type (fallback)
   - Enviar nova mensagem
   - Manter contexto do agente

### E2E Tests

**Cenários críticos**:
1. Usuário completa fluxo completo (site → seleção → conversa → nova mensagem)
2. Usuário alterna entre chats de agentes diferentes
3. Usuário cria múltiplos chats do mesmo agente
4. Refresh da página mantém contexto
5. Logout e login mantém histórico

### Manual Testing Checklist

- [ ] WelcomeChat renderiza corretamente
- [ ] Cards de agentes são clicáveis
- [ ] ChatNeoMsg exibe conteúdo correto por agente
- [ ] Sugestões são específicas do agente
- [ ] Primeira mensagem salva agent_type
- [ ] Mensagens subsequentes usam agent_type correto
- [ ] Carregar chat antigo recupera agent_type
- [ ] Fallback funciona para chats sem agent_type
- [ ] Sidebar exibe 2 botões corretamente
- [ ] Sidebar colapsada exibe ícones corretos
- [ ] Alternância entre chats mantém contexto
- [ ] Refresh mantém estado
- [ ] Erros são tratados graciosamente

## Performance Considerations

### 1. Lazy Loading de Configurações

```typescript
// Carregar apenas config do agente ativo
const activeConfig = agentConfigs[currentAgentType];
```

**Benefício**: Reduz memória e processamento inicial

### 2. Memoização de Componentes

```typescript
const WelcomeChat = React.memo(({ onAgentSelect }) => {
  // ... componente
});

const ChatNeoMsg = React.memo(({ agentType, onFirstMessage, isLoading }) => {
  // ... componente
});
```

**Benefício**: Evita re-renders desnecessários

### 3. Debounce de Persistência

```typescript
// Já implementado no ChatPage
useEffect(() => {
  const timeoutId = setTimeout(() => {
    persistUIState(currentSessionId, isWelcomeMode);
  }, 500);
  return () => clearTimeout(timeoutId);
}, [currentSessionId, isWelcomeMode]);
```

**Benefício**: Reduz writes no localStorage

### 4. Batch State Updates

```typescript
React.startTransition(() => {
  setCurrentAgentType(agentType);
  setIsWelcomeMode(true);
  setShowWelcomeChat(false);
});
```

**Benefício**: Agrupa múltiplas atualizações de estado

## Security Considerations

### 1. Validação de Agent Type

**Frontend**:
```typescript
if (!isValidAgentType(agentType)) {
  console.warn('Invalid agent type, using fallback');
  agentType = 'dante-ri';
}
```

**Backend** (ef_save_chat):
```typescript
if (agent_type && !['dante-ri', 'dante-notas'].includes(agent_type)) {
  return new Response(JSON.stringify({ error: 'Invalid agent_type' }), 
    { status: 400 });
}
```

### 2. Sanitização de Inputs

**Já implementado**: Todos os inputs passam por validação antes de envio

### 3. Autenticação de Requisições

**Já implementado**: 
- Supabase Auth JWT em todas as requisições
- Edge functions validam user_id
- RLS policies no banco

### 4. Rate Limiting

**Consideração**: Implementar rate limiting por agente se necessário

### 5. API Keys Seguras

**Já implementado**:
- API keys em variáveis de ambiente
- Não expostas no frontend
- Diferentes keys por ambiente (dev/prod)

## Migration Strategy

### Fase 1: Preparação (Sem Breaking Changes)

1. ✅ Backend já preparado (ef_save_chat aceita agent_type opcional)
2. ✅ Coluna agent_type já existe no banco
3. Criar arquivo `agentConfigs.ts`
4. Criar componente `WelcomeChat`

### Fase 2: Modificações Incrementais

1. Modificar `ChatNeoMsg` para aceitar `agentType` prop
2. Adicionar estado `currentAgentType` no `ChatPage`
3. Modificar `SidebarCollapse` para 2 botões
4. Modificar `fun_call_langflow` para roteamento

### Fase 3: Integração

1. Conectar `WelcomeChat` ao fluxo do Header
2. Propagar `currentAgentType` para todos os componentes
3. Atualizar `handleFirstMessage` e `handleSendMessage`
4. Atualizar `fun_load_chat_session`

### Fase 4: Testes e Validação

1. Testes unitários
2. Testes de integração
3. Testes E2E
4. Testes manuais

### Fase 5: Deploy e Monitoramento

1. Deploy em ambiente de staging
2. Testes com usuários beta
3. Monitoramento de erros
4. Deploy em produção
5. Monitoramento contínuo

## Rollback Plan

**Se necessário reverter**:

1. **Frontend**: Remover prop `agentType`, usar sempre 'dante-ri'
2. **Backend**: Já é compatível (agent_type opcional)
3. **Banco**: Coluna agent_type pode permanecer (não quebra nada)
4. **Cache**: Ignorar campo agent_type se presente

**Impacto**: Zero downtime, sistema volta ao comportamento anterior

## Future Enhancements

### 1. Adicionar Novos Agentes

**Processo**:
1. Adicionar entrada em `agentConfigs.ts`
2. Adicionar variável de ambiente `VITE_LANGFLOW_FLOW_ID_[AGENTE]`
3. Atualizar tipo `AgentType`
4. Atualizar validação no backend

**Tempo estimado**: 30 minutos por agente

### 2. Agente Híbrido

**Conceito**: Agente que consulta múltiplos especialistas

**Implementação**:
```typescript
'dante-hibrido': {
  id: 'dante-hibrido',
  title: 'Consulta Múltiplos Especialistas',
  // ... config
  multiAgent: true,
  agents: ['dante-ri', 'dante-notas']
}
```

### 3. Recomendação Inteligente de Agente

**Conceito**: Sugerir agente baseado no conteúdo da pergunta

**Implementação**:
- Análise de keywords na primeira mensagem
- Sugestão de troca de agente se relevante
- ML model para classificação

### 4. Analytics por Agente

**Métricas**:
- Uso por agente
- Taxa de satisfação por agente
- Tempo médio de resposta por agente
- Tópicos mais consultados por agente

### 5. Personalização de Agentes

**Conceito**: Usuários podem customizar comportamento

**Features**:
- Tom de voz (formal/informal)
- Nível de detalhe (básico/avançado)
- Preferências de formatação

## Conclusion

Este design fornece uma arquitetura escalável e manutenível para o sistema multi-agente, seguindo os padrões Supabase e React estabelecidos no projeto. A implementação é incremental, sem breaking changes, e preparada para expansão futura.

**Próximos Passos**: Criar documento de tasks (implementation plan) detalhando cada tarefa de código.
