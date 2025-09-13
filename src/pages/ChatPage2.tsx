import React from 'react';
import ChatHeader from '@/components/chat_header';
import ChatSidebar from '@/components/chat_sidebar';
import ChatArea2 from '@/components/chat_area2';

export default function ChatPage2() {
  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Header fixo no topo */}
      <ChatHeader />
      
      {/* Layout principal com flexbox */}
      <div className="flex h-full" style={{ paddingTop: '80px' }}>
        {/* Sidebar fixa à esquerda */}
        <ChatSidebar />
        
        {/* Área de chat à direita - sem chat_msg_header */}
        <div className="flex-1 flex flex-col bg-white" style={{ height: 'calc(100vh - 80px)' }}>
          {/* ChatArea sem o ChatMsgHeader */}
          <ChatArea2 />
        </div>
      </div>
    </div>
  );
}