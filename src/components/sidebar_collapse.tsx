import React, { useState } from 'react';
import { ScrollText, MoreHorizontal, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isEmpty: boolean;
  isActive: boolean;
}

interface SidebarCollapseProps {
}

export default function SidebarCollapse() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Registro de Matrícula',
      lastMessage: '',
      timestamp: '19/Jan/25 - 14:30',
      isEmpty: false,
      isActive: true,
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Função para formatar data/hora
  const formatDateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                   'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const month = months[now.getMonth()];
    const year = now.getFullYear().toString().slice(-2);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Nova conversa',
      lastMessage: '',
      timestamp: formatDateTime(),
      isEmpty: true,
      isActive: false,
    };

    // Desativa todos os chats e ativa o novo
    setChats(prev => [
      newChat,
      ...prev.map(chat => ({ ...chat, isActive: false }))
    ]);
  };

  const handleChatClick = (chatId: string) => {
    setChats(prev => prev.map(chat => ({
      ...chat,
      isActive: chat.id === chatId
    })));
    setActiveDropdown(null);
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

  const handleSaveRename = (chatId: string) => {
    if (editTitle.trim()) {
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: editTitle.trim() }
          : chat
      ));
    }
    setEditingChat(null);
    setEditTitle('');
  };

  const handleCancelRename = () => {
    setEditingChat(null);
    setEditTitle('');
  };

  const handleDelete = (chatId: string) => {
    setChats(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);
      // Se o chat deletado era o ativo, ativa o primeiro da lista
      if (prev.find(chat => chat.id === chatId)?.isActive && filtered.length > 0) {
        filtered[0].isActive = true;
      }
      return filtered;
    });
    setActiveDropdown(null);
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
        className={`${isCollapsed ? 'w-[64px]' : 'w-[350px]'} bg-white border-r border-gray-200 flex-shrink-0 flex flex-col transition-all duration-300`} 
        style={{ height: 'calc(100vh - 60px)' }}
      >
        {/* Header com botão de colapso e Novo Chat */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-b border-gray-200`}>
          {/* Botão de colapso */}
          <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} mb-3`}>
            <Button
              onClick={() => setIsCollapsed(!isCollapsed)}
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8 hover:bg-gray-100"
            >
              {isCollapsed ? (
                <ChevronRight className="h-6 w-6 text-neutral-500 font-bold stroke-[3]" />
              ) : (
                <ChevronLeft className="h-6 w-6 text-neutral-500 font-bold stroke-[3]" />
              )}
            </Button>
          </div>

          {/* Botão Novo Chat */}
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center">
                  <Button
                    onClick={handleNewChat}
                    className="bg-neutral-500 hover:bg-neutral-600 text-white p-2 h-8 w-8 flex items-center justify-center"
                  >
                    <ScrollText className="h-4 w-4" />
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
              <ScrollText className="h-4 w-4" />
              <span>Novo Chat</span>
            </Button>
          )}
        </div>

        {/* Lista de Chats */}
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2' : 'p-4'} sidebar-scrollbar`}>
          {!isCollapsed && (
            <h2 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
              Histórico de Conversas
            </h2>
          )}
          
          <div className="space-y-2">
            {chats.map((chat) => (
              <div key={chat.id}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-center">
                        <div
                          className={`relative group p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-center h-8 w-8 ${
                            chat.isActive
                              ? 'bg-neutral-200 border-neutral-300 shadow-sm'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                          onClick={() => handleChatClick(chat.id)}
                        >
                          <ScrollText className={`h-4 w-4 ${
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
                        ? 'bg-neutral-200 border-neutral-300 shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
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
                            onKeyPress={(e) => handleKeyPress(e, chat.id)}
                            className="w-full text-sm font-medium bg-white border border-orange-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p className={`text-sm font-medium truncate ${
                            chat.isActive ? 'text-neutral-800' : 'text-gray-900'
                          }`}>
                            {chat.title}
                            {chat.isEmpty && (
                              <span className="ml-2 text-xs text-gray-400">(vazio)</span>
                            )}
                          </p>
                        )}
                        {chat.lastMessage && (
                          <p className={`text-xs mt-1 truncate ${
                            chat.isActive ? 'text-neutral-600' : 'text-gray-600'
                          }`}>
                            {chat.lastMessage}
                          </p>
                        )}
                        <p className={`text-xs mt-1 ${
                          chat.isActive ? 'text-neutral-600' : 'text-gray-600'
                        }`}>
                          {chat.timestamp}
                        </p>
                      </div>

                      {/* Botão de opções */}
                      <div className="relative">
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
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRename(chat.id, chat.title);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            >
                              <Edit2 className="h-3 w-3" />
                              <span>Renomear</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(chat.id);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
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
              <p className="text-sm text-gray-500">Nenhuma conversa ainda</p>
              <p className="text-xs text-gray-400 mt-1">Clique em "Novo Chat" para começar</p>
            </div>
          )}
        </div>

        {/* Rodapé com informações */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600 text-center">
              {chats.length} conversa{chats.length !== 1 ? 's' : ''} • Dante AI
            </p>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}