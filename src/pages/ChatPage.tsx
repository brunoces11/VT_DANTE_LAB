import React, { useState } from 'react';
import ChatHeader from '@/components/chat_header';
import ChatSessao from '@/components/ChatSessao';

export default function ChatPage() {
  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Header fixo no topo */}
      <ChatHeader />
      
      {/* Layout principal com flexbox */}
      <div className="flex h-full" style={{ paddingTop: '60px' }}>
        {/* Chat completo com sidebar integrada */}
        <ChatSessao />
      </div>
    </div>
  );
}