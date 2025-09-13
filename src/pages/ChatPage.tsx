import React from 'react';
import ChatHeader from '@/components/chat_header';
import ChatSidebar from '@/components/chat_sidebar';
import ChatArea from '@/components/chat_area';

export default function ChatPage() {
  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Header fixo no topo */}
      <ChatHeader />
      
      {/* Layout principal com flexbox */}
      <div className="flex h-full" style={{ paddingTop: '90px' }}>
        {/* Sidebar fixa à esquerda */}
        <ChatSidebar />
        
        {/* Área de chat à direita */}
        <ChatArea />
      </div>
    </div>
  );
}