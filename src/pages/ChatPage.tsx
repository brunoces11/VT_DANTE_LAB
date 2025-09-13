import React from 'react';
import ChatHeader from '@/components/chat_header';
import ChatSidebar from '@/components/chat_sidebar';
import ChatArea from '@/components/chat_area';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header fixo no topo */}
      <ChatHeader />
      
      {/* Layout principal com flexbox */}
      <div className="flex" style={{ paddingTop: '100px' }}>
        {/* Sidebar fixa à esquerda */}
        <ChatSidebar />
        
        {/* Área de chat à direita */}
        <ChatArea />
      </div>
    </div>
  );
}