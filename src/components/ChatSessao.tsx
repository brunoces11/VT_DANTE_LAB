import React, { useRef, useEffect } from 'react';
import { Send, Copy, Plus, Trash2, Edit2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatSessions } from '@/hooks/useChatSessions';
import { copyToClipboard } from '../../services/util_clipboard';

export default function ChatSessao() {
  const {
    sessions,
    currentSession,
    inputValue,
    setInputValue,
    isLoading,
    createNewSession,
    deleteSession,
    switchSession,
    updateSessionTitle,
    handleSendMessage,
    handleKeyPress,
  } = useChatSessions();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleCopyMessage = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      // You could add a toast notification here
      console.log('Message copied to clipboard');
    }
  };

  const handleEditTitle = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditTitle(currentTitle);
  };

  const handleSaveTitle = (sessionId: string) => {
    if (editTitle.trim()) {
      updateSessionTitle(sessionId, editTitle.trim());
    }
    setEditingSessionId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditTitle('');
  };

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <Button
            onClick={createNewSession}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Conversa</span>
          </Button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group p-3 rounded-lg border cursor-pointer transition-all ${
                session.id === currentSession?.id
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => switchSession(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {editingSessionId === session.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleSaveTitle(session.id)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSaveTitle(session.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="w-full text-sm font-medium bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.title}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {session.messages.length} mensagens
                  </p>
                </div>

                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTitle(session.id, session.title);
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentSession?.title || 'Selecione uma conversa'}
              </h2>
              <p className="text-sm text-gray-500">
                Dante AI - Especialista em Registro de Imóveis
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentSession?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-xs ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {message.sender === 'bot' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 ml-2 hover:bg-gray-200"
                      onClick={() => handleCopyMessage(message.text)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-lg p-4 max-w-[70%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite sua pergunta sobre Registro de Imóveis..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Dante AI pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
}