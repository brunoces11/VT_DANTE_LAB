import React, { useState, useEffect, useRef } from 'react';
import { Home, MoreHorizontal, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { fun_renomear_chat } from '../../services/supabase';
import { useAuth } from './auth/AuthProvider';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isEmpty: boolean;
  isActive: boolean;
}

interface SidebarCollapseProps {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  onChatClick: (sessionId: string) => void;
  onNewChat: () => void;
  currentSessionId: string | null;
}

export default function SidebarCollapse({ chats, setChats, onChatClick, onNewChat }: SidebarCollapseProps) {
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!activeDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const activeRef = dropdownRefs.current.get(activeDropdown);
      
      // Fecha se clicou fora do dropdown ativo
      if (activeRef && !activeRef.contains(target)) {
        setActiveDropdown(null);
      }
    };

    // Pequeno delay para evitar fechar imediatamente após abrir
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);



  const handleNewChat = () => {
    console.log('🆕 Sidebar: Iniciando novo chat');
    onNewChat(); // Chamar função do pai para ativar modo welcome
  };

  const handleChatClick = (chatId: string) => {
    setChats(prev => prev.map(chat => ({
      ...chat,
      isActive: chat.id === chatId
    })));
    setActiveDropdown(null);
    
    // 🎯 PERSISTIR imediatamente a seleção do chat
    console.log('🎯 Chat selecionado:', chatId.slice(0, 6));
    
    onChatClick(chatId); // Chamar função para carregar mensagens
  };

  const handleDropdownToggle = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === chatId ? null : chatId);
  };

  const handleRename = (chatId: string, currentTitle: string) => {
    setEditingChat(chatId);
    setEditTitle(currentTitle);
    setActiveDropdown(null);
  };

  const handleSaveRename = async (chatId: string) => {
    if (!editTitle.trim() || !user?.id) {
      setEditingChat(null);
      setEditTitle('');
      return;
    }

    setIsRenaming(true);
    
    try {
      // Chamar API para renomear no banco
      const result = await fun_renomear_chat({
        chat_session_id: chatId,
        new_title: editTitle.trim(),
        user_id: user.id
      });

      if (result.success) {
        // Atualizar estado local apenas se API foi bem-sucedida
        setChats(prev => prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, title: editTitle.trim() }
            : chat
        ));
        
        // 🔄 INVALIDAR CACHE após mutação (padrão Supabase)
        console.log('🔄 Invalidando cache após renomeação...');
        const { updateSessionInCache } = await import('../../services/cache-service');
        updateSessionInCache(chatId, {
          title: editTitle.trim(),
          last_updated: new Date().toISOString()
        });
        console.log('✅ Cache invalidado e atualizado');
        
        console.log(`✅ Chat ${chatId.slice(0, 6)} renomeado para: "${editTitle.trim()}"`);
      } else {
        console.warn('⚠️ Falha ao renomear:', result.error);
        // Manter título original em caso de erro
      }
    } catch (error) {
      console.error('❌ Erro ao renomear chat:', error);
      // Manter título original em caso de erro
    } finally {
      setIsRenaming(false);
      setEditingChat(null);
      setEditTitle('');
    }
  };

  const handleCancelRename = () => {
    setEditingChat(null);
    setEditTitle('');
  };

  const handleDelete = (chatId: string) => {
    // Integrar removeSessionFromCache para consistência
    import('../../services/cache-service').then(({ removeSessionFromCache }) => {
      removeSessionFromCache(chatId);
    });
    
    // Remover também do localStorage antigo
    
    const wasActiveChat = chats.find(chat => chat.id === chatId)?.isActive;
    
    setChats(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);
      return filtered;
    });
    setActiveDropdown(null);
    
    // 🎯 Se o chat deletado era o ativo, redirecionar para Welcome Chat
    if (wasActiveChat) {
      console.log('🗑️ Chat ativo deletado, redirecionando para Welcome Chat');
      onNewChat(); // Chamar função para ativar modo welcome
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(chatId);
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  return (
    <TooltipProvider>
      <aside
        className={`${isCollapsed ? 'w-[64px]' : 'w-[350px]'} bg-background border-r border-border flex-shrink-0 flex flex-col transition-all duration-300`} 
        style={{ height: 'calc(100vh - 60px)' }}
      >
        {/* Header com botão de colapso e Novo Chat */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-b border-border`}>
          {/* Botão de colapso */}
          <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} mb-3`}>
            <Button
              onClick={() => setIsCollapsed(!isCollapsed)}
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8 hover:bg-accent"
            >
              {isCollapsed ? (
                <ChevronRight className="h-7 w-7 text-muted-foreground font-bold stroke-[3]" style={{ transform: 'translate(3px, 2px)' }} />
              ) : (
                <ChevronLeft className="h-7 w-7 text-muted-foreground font-bold stroke-[3]" style={{ transform: 'translate(2px, 2px)' }} />
              )}
            </Button>
          </div>

          {/* Botão Novo Chat */}
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center mb-2">
                  <Button
                    onClick={handleNewChat}
                    className="bg-neutral-500 hover:bg-neutral-600 text-white p-2 h-8 w-8 flex items-center justify-center"
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Novo Chat</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center space-x-2 bg-neutral-500 hover:bg-neutral-600 text-white"
            >
              <Home className="h-4 w-4" />
              <span>Novo Chat</span>
            </Button>
          )}
        </div>

        {/* Lista de Chats */}
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2' : 'p-4'} sidebar-scrollbar`}>
          {!isCollapsed && (
            <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Histórico de Conversas
            </h2>
          )}
          
          <div className={isCollapsed ? 'space-y-3' : 'space-y-2'}>
            {chats.map((chat, index) => (
              <div key={chat.id} className={isCollapsed && index === 0 ? 'mt-2' : ''}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-center">
                        <div
                          className={`relative group p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-center h-8 w-8 ${
                            chat.isActive
                              ? 'bg-accent border-border shadow-sm'
                              : 'bg-muted border-border hover:bg-accent'
                          }`}
                          onClick={() => handleChatClick(chat.id)}
                        >
                          <Home className={`h-4 w-4 ${
                            chat.isActive ? 'text-neutral-700' : 'text-gray-600'
                          }`} />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{chat.title}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div
                    className={`relative group p-3 rounded-lg border cursor-pointer transition-all ${
                      chat.isActive
                        ? 'bg-accent border-border shadow-sm'
                        : 'bg-muted border-border hover:bg-accent'
                    }`}
                    onClick={() => handleChatClick(chat.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {editingChat === chat.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleSaveRename(chat.id)}
                            onKeyDown={(e) => handleKeyPress(e, chat.id)}
                            className={`w-full text-sm font-medium border rounded px-2 py-1 focus:outline-none focus:ring-2 ${
                              isRenaming
                                ? 'bg-muted border-border cursor-wait'
                                : 'bg-background border-orange-300 focus:ring-orange-500 dark:bg-neutral-800'
                            }`}
                            disabled={isRenaming}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            placeholder={isRenaming ? 'Salvando...' : ''}
                          />
                        ) : (
                          <p className={`text-sm font-medium truncate ${
                            chat.isActive ? 'text-foreground' : 'text-foreground'
                          }`}>
                            {chat.title}
                            {chat.isEmpty && (
                              <span className="ml-2 text-xs text-muted-foreground">(vazio)</span>
                            )}
                          </p>
                        )}
                        {chat.lastMessage && (
                          <p className={`text-xs mt-1 truncate ${
                            chat.isActive ? 'text-muted-foreground' : 'text-muted-foreground'
                          }`}>
                            {chat.lastMessage}
                          </p>
                        )}
                        <p className={`text-xs mt-1 ${
                          chat.isActive ? 'text-muted-foreground' : 'text-muted-foreground'
                        }`}>
                          {chat.timestamp}
                        </p>
                      </div>

                      {/* Botão de opções */}
                      <div 
                        className="relative"
                        ref={(el) => {
                          if (el) dropdownRefs.current.set(chat.id, el);
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                          onClick={(e) => handleDropdownToggle(chat.id, e)}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>

                        {/* Dropdown de opções */}
                        {activeDropdown === chat.id && (
                          <div className="absolute right-0 top-full mt-1 w-32 bg-popover rounded-lg shadow-lg border border-border py-1 z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRename(chat.id, chat.title);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent flex items-center space-x-2"
                            >
                              <Edit2 className="h-3 w-3" />
                              <span>Renomear</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(chat.id);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Deletar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {chats.length === 0 && !isCollapsed && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Nenhuma conversa ainda</p>
              <p className="text-xs text-muted-foreground mt-1">Clique em "Novo Chat" para começar</p>
            </div>
          )}
        </div>

        {/* Rodapé com informações */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border bg-muted">
            <p className="text-xs text-muted-foreground text-center">
              {chats.length} conversa{chats.length !== 1 ? 's' : ''} • Dante AI
            </p>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}