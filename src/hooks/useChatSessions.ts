import { useState, useEffect } from 'react';
import { sendToLangflow } from '../../services/langflow';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with a default session
  useEffect(() => {
    const defaultSession: ChatSession = {
      id: 'default-session',
      title: 'Nova Conversa',
      messages: [
        {
          id: 'welcome-message',
          text: 'Olá! Sou o Dante AI, especialista em Registro de Imóveis. Como posso ajudá-lo hoje?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions([defaultSession]);
    setCurrentSessionId(defaultSession.id);
  }, []);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'Nova Conversa',
      messages: [
        {
          id: `welcome-${Date.now()}`,
          text: 'Olá! Sou o Dante AI, especialista em Registro de Imóveis. Como posso ajudá-lo hoje?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setInputValue('');
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => {
      const filtered = prev.filter(session => session.id !== sessionId);
      
      // If we deleted the current session, switch to the first available session
      if (sessionId === currentSessionId && filtered.length > 0) {
        setCurrentSessionId(filtered[0].id);
      } else if (filtered.length === 0) {
        // If no sessions left, create a new one
        const newSession: ChatSession = {
          id: `session-${Date.now()}`,
          title: 'Nova Conversa',
          messages: [
            {
              id: `welcome-${Date.now()}`,
              text: 'Olá! Sou o Dante AI, especialista em Registro de Imóveis. Como posso ajudá-lo hoje?',
              sender: 'bot',
              timestamp: new Date(),
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setCurrentSessionId(newSession.id);
        return [newSession];
      }
      
      return filtered;
    });
  };

  const switchSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const updateSessionTitle = (sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, title: newTitle, updatedAt: new Date() }
        : session
    ));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !currentSessionId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message to current session
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId
        ? {
            ...session,
            messages: [...session.messages, userMessage],
            updatedAt: new Date(),
          }
        : session
    ));

    const currentInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      // Call Langflow API
      const botResponse = await sendToLangflow({
        inputValue: currentInput,
        inputType: 'chat',
        outputType: 'chat',
      });

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      // Add bot response to current session
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, botMessage],
              updatedAt: new Date(),
            }
          : session
      ));

      // Update session title based on first user message if it's still "Nova Conversa"
      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId && session.title === 'Nova Conversa') {
          const truncatedTitle = currentInput.length > 30 
            ? currentInput.substring(0, 30) + '...' 
            : currentInput;
          return {
            ...session,
            title: truncatedTitle,
            updatedAt: new Date(),
          };
        }
        return session;
      }));

    } catch (error) {
      console.error('Error sending message to Langflow:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'bot',
        timestamp: new Date(),
      };

      // Add error message to current session
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, errorMessage],
              updatedAt: new Date(),
            }
          : session
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentSession = sessions.find(session => session.id === currentSessionId);

  return {
    sessions,
    currentSession,
    currentSessionId,
    inputValue,
    setInputValue,
    isLoading,
    createNewSession,
    deleteSession,
    switchSession,
    updateSessionTitle,
    handleSendMessage,
    handleKeyPress,
  };
}