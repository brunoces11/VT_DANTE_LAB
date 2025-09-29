import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatHeader from '@/components/chat_header';
import SidebarCollapse from '@/components/sidebar_collapse';
import ChatArea from '@/components/chat_area';
import { useAuth } from '@/components/auth/AuthProvider';
import { getCurrentTimestampUTC, formatDateTimeBR } from '@/utils/timezone';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isEmpty: boolean;
  isActive: boolean;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isLoading?: boolean;
  loadingText?: string;
}

export default function ChatPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWelcomeMode, setIsWelcomeMode] = useState<boolean>(false);

  // Função para carregar mensagens de uma sessão específica
  const fun_load_chat_session = (sessionId: string) => {
    try {
      console.log(`🔄 Carregando mensagens da sessão: ${sessionId}`);
      
      // Buscar dados do localStorage
      const userChatData = localStorage.getItem('user_chat_data');
      
      if (!userChatData) {
        console.log('📭 Nenhum dado encontrado no localStorage');
        setMessages([]);
        return;
      }
      
      const parsedData = JSON.parse(userChatData);
      
      // Encontrar a sessão específica
      const session = parsedData.chat_sessions?.find((s: any) => s.chat_session_id === sessionId);
      
      if (!session || !session.messages) {
        console.log('📭 Sessão não encontrada ou sem mensagens');
        setMessages([]);
        setCurrentSessionId(sessionId);
        setIsWelcomeMode(false); // Desativar modo welcome
        return;
      }
      
      // Converter mensagens do localStorage para formato Message
      const convertedMessages: Message[] = [];
      let messageId = 1;
      
      session.messages.forEach((msg: any) => {
        // Adicionar pergunta do usuário (msg_input)
        if (msg.msg_input) {
          convertedMessages.push({
            id: messageId++,
            content: msg.msg_input,
            sender: 'user',
            timestamp: getCurrentTimestampUTC(),
          });
        }
        
        // Adicionar resposta do LLM (msg_output)
        if (msg.msg_output) {
          convertedMessages.push({
            id: messageId++,
            content: msg.msg_output,
            sender: 'bot',
            timestamp: getCurrentTimestampUTC(),
          });
        }
      });
      
      console.log(`✅ ${convertedMessages.length} mensagens carregadas da sessão`);
      setMessages(convertedMessages);
      setCurrentSessionId(sessionId);
      setIsWelcomeMode(false); // Desativar modo welcome
      
    } catch (error) {
      console.error('❌ Erro ao carregar mensagens da sessão:', error);
      setMessages([]);
    }
  };

  // Função para criar nova sessão de chat (modo welcome)
  const fun_create_chat_session = () => {
    console.log('🆕 Criando nova sessão de chat - modo welcome');
    setCurrentSessionId(null);
    setMessages([]);
    setIsWelcomeMode(true); // Ativar modo welcome
  };

  // Função para lidar com a primeira mensagem (transição welcome → conversa)
  const handleFirstMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isLoading) return;

    console.log('🚀 Processando primeira mensagem:', inputValue);

    // 1. Criar nova sessão
    const newSessionId = Date.now().toString();
    
    // 2. Criar primeira mensagem do usuário
    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: getCurrentTimestampUTC(),
    };
    
    // 3. Atualizar estados
    setCurrentSessionId(newSessionId);
    setMessages([userMessage]);
    setIsWelcomeMode(false); // Sair do modo welcome
    setIsLoading(true);
    
    // 4. Adicionar nova conversa ao sidebar
    const newChat: Chat = {
      id: newSessionId,
      title: inputValue.length > 50 ? inputValue.substring(0, 50) + '...' : inputValue,
      lastMessage: '',
      timestamp: formatDateTimeBR(getCurrentTimestampUTC()),
      isEmpty: false,
      isActive: true,
    };
    
    setChats(prev => [
      newChat,
      ...prev.map(chat => ({ ...chat, isActive: false }))
    ]);

    // 5. Processar resposta da IA (usar lógica similar ao ChatArea)
    // Iniciar sequência de loading
    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: '',
      sender: 'bot',
      timestamp: getCurrentTimestampUTC(),
      isLoading: true,
      loadingText: 'Consultando Base Legal vigente...',
    };

    setMessages(prev => [...prev, loadingMessage]);

    // Sequência de loading
    const loadingSequence = [
      { text: 'Consultando Base Legal vigente...', delay: 1500 },
      { text: 'Acessando Leis Federais...', delay: 1000 },
      { text: 'Acessando Leis Estaduais...', delay: 700 },
      { text: 'Acessando Documentos normativos:', delay: 800 },
      { text: 'Provimentos, Codigo de Normas...', delay: 500 },
      { text: 'Consolidando fundamentos jurídicos...', delay: 600 },
      { text: 'O Dante está processando sua resposta, por favor aguarde...', delay: 0 }
    ];

    let currentDelay = 0;
    loadingSequence.forEach((step, index) => {
      currentDelay += step.delay;
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.isLoading ? { ...msg, loadingText: step.text } : msg
        ));
      }, currentDelay);
    });

    // Simular resposta da IA
    const totalLoadingTime = loadingSequence.reduce((sum, step) => sum + step.delay, 0);
    setTimeout(() => {
      const responses = [
        "## Análise Legal - Lei 6.015/73\n\nCom base na **legislação vigente**, especificamente na **Lei 6.015/73** (Lei de Registros Públicos), posso orientá-lo sobre esse procedimento.\n\n### Para essa situação específica, é necessário verificar:\n\n#### 📋 Documentação Exigida\n- Título hábil para registro\n- Certidões atualizadas\n- Comprovantes fiscais\n\n#### ⏰ Prazos Legais\n- Prazo de apresentação\n- Validade das certidões\n- Prazos processuais\n\n#### 💰 Tributos Incidentes\n- ITBI quitado\n- Emolumentos devidos\n- Taxas cartoriais\n\n#### ✅ Qualificação Registral\n- Análise da cadeia dominial\n- Verificação de vícios\n- Conformidade legal\n\n> **Pergunta**: Poderia fornecer mais detalhes sobre o caso específico?",
        
        "# Procedimento Registral - Art. 167 da Lei 6.015/73\n\nSegundo o **artigo 167** da Lei 6.015/73 e as **normas do CNJ**, esse procedimento requer atenção especial aos seguintes aspectos:\n\n## 🔍 Aspectos Fundamentais\n\n### 1. Análise da Cadeia Dominial\n- Verificação de **continuidade registral**\n- Conferência de **titularidade**\n- Análise de **vícios anteriores**\n\n### 2. Verificação de Ônus e Gravames\n- **Hipotecas** existentes\n- **Penhoras** judiciais\n- **Usufrutos** e servidões\n\n### 3. Conferência da Documentação\n- **Autenticidade** dos documentos\n- **Validade** das certidões\n- **Completude** da instrução\n\n### 4. Cálculo de Emolumentos\n- Tabela oficial vigente\n- Valores corretos\n- Recolhimentos devidos\n\n> ⚖️ **Importante**: A qualificação registral deve ser **rigorosa** para garantir a **segurança jurídica** do ato.",
        
        "## 📚 Legislação de Registro de Imóveis\n\nDe acordo com a **legislação de Registro de Imóveis**, essa questão envolve procedimentos específicos que devem ser observados:\n\n### 📖 Fontes Normativas\n\n#### Base Legal Principal\n- **Lei 6.015/73** - Lei de Registros Públicos\n- **Código Civil** - Arts. 1.245 a 1.247\n- **Lei 8.935/94** - Lei dos Cartórios\n\n#### Normas Complementares\n- **CNJ** - Provimentos e Resoluções\n- **Corregedorias Estaduais**\n- **ANOREG** - Orientações técnicas\n\n#### Jurisprudência Consolidada\n- **STJ** - Superior Tribunal de Justiça\n- **Tribunais Estaduais**\n- **Enunciados** do CJF\n\n---\n\n### 🎯 Análise Individualizada\n\n> Cada caso possui **particularidades** que devem ser analisadas individualmente.\n\n**Precisa de orientação sobre algum aspecto específico?**\n\n*Estou aqui para ajudar com questões detalhadas sobre seu caso.*"
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Remover mensagem de loading e adicionar resposta real
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, {
          id: Date.now() + 2,
          content: randomResponse,
          sender: 'bot',
          timestamp: getCurrentTimestampUTC(),
        }];
      });
      
      setIsLoading(false);
    }, totalLoadingTime + Math.random() * 1000 + 1500);
  };

  // Função para carregar apenas o sidebar sem ativar sessão (para modo welcome)
  const fun_load_sidebar_only = () => {
    try {
      console.log('🔄 Carregando apenas dados do sidebar (modo welcome)...');
      
      // Buscar dados do localStorage
      const userChatData = localStorage.getItem('user_chat_data');
      
      if (!userChatData) {
        console.log('📭 Nenhum dado encontrado no localStorage, sidebar vazio');
        setChats([]);
        return;
      }
      
      const parsedData = JSON.parse(userChatData);
      
      // Validar estrutura dos dados
      if (!parsedData.chat_sessions || !Array.isArray(parsedData.chat_sessions)) {
        console.log('📭 Estrutura inválida ou sem sessões, sidebar vazio');
        setChats([]);
        return;
      }
      
      // Converter sessões para formato do Chat SEM ATIVAR NENHUMA
      const loadedChats: Chat[] = parsedData.chat_sessions.map((session: any) => ({
        id: session.chat_session_id,
        title: session.chat_session_title,
        lastMessage: '',
        timestamp: '19/Jan/25 - 14:30', // Mantém hardcoded como solicitado
        isEmpty: false,
        isActive: false // TODAS INATIVAS para modo welcome
      }));
      
      console.log(`✅ ${loadedChats.length} sessões carregadas no sidebar (modo welcome)`);
      setChats(loadedChats);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do sidebar:', error);
      setChats([]);
    }
  };

  // Função para carregar dados do sidebar a partir do localStorage
  const fun_load_sidebar = () => {
    try {
      console.log('🔄 Carregando dados do sidebar...');
      
      // Buscar dados do localStorage
      const userChatData = localStorage.getItem('user_chat_data');
      
      if (!userChatData) {
        console.log('📭 Nenhum dado encontrado no localStorage, sidebar vazio');
        setChats([]);
        return;
      }
      
      const parsedData = JSON.parse(userChatData);
      
      // Validar estrutura dos dados
      if (!parsedData.chat_sessions || !Array.isArray(parsedData.chat_sessions)) {
        console.log('📭 Estrutura inválida ou sem sessões, sidebar vazio');
        setChats([]);
        return;
      }
      
      // Converter sessões para formato do Chat
      const loadedChats: Chat[] = parsedData.chat_sessions.map((session: any, index: number) => ({
        id: session.chat_session_id,
        title: session.chat_session_title,
        lastMessage: '',
        timestamp: '19/Jan/25 - 14:30', // Mantém hardcoded como solicitado
        isEmpty: false,
        isActive: index === 0 // Primeira sessão ativa por padrão
      }));
      
      console.log(`✅ ${loadedChats.length} sessões carregadas no sidebar`);
      setChats(loadedChats);
      
      // Carregar primeira sessão automaticamente se existir
      if (loadedChats.length > 0) {
        fun_load_chat_session(loadedChats[0].id);
      } else {
        // Se não há sessões, ativar modo welcome
        setMessages([]);
        setCurrentSessionId(null);
        setIsWelcomeMode(true);
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do sidebar:', error);
      setChats([]);
      // Ativar modo welcome em caso de erro
      setMessages([]);
      setCurrentSessionId(null);
      setIsWelcomeMode(true);
    }
  };

  // Redireciona para home se usuário não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Carregar dados do sidebar quando componente monta
  useEffect(() => {
    if (user && !loading) {
      // Verificar se veio do header com intenção de iniciar novo chat
      const state = location.state as { startWelcome?: boolean } | null;
      if (state?.startWelcome) {
        console.log('🎯 Iniciando modo welcome via header');
        // Carregar sidebar mas sem ativar sessão
        fun_load_sidebar_only();
        // Ativar modo welcome
        fun_create_chat_session();
        // Limpar o state para evitar reativação
        navigate(location.pathname, { replace: true });
      } else {
        fun_load_sidebar();
      }
    }
  }, [user, loading, location.state]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não renderiza nada se usuário não estiver logado (será redirecionado)
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Header fixo no topo */}
      <ChatHeader />
      
      {/* Layout principal com flexbox */}
      <div className="flex h-full" style={{ paddingTop: '60px' }}>
        {/* Sidebar fixa à esquerda */}
        <SidebarCollapse 
          chats={chats} 
          setChats={setChats} 
          onChatClick={fun_load_chat_session}
          onNewChat={fun_create_chat_session}
          currentSessionId={currentSessionId}
        />
        
        {/* Área de chat à direita */}
        <ChatArea 
          messages={messages}
          setMessages={setMessages}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isWelcomeMode={isWelcomeMode}
          onFirstMessage={handleFirstMessage}
        />
      </div>
    </div>
  );
}