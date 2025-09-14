import React, { useState } from 'react';
import ChatHeader from '@/components/chat_header';
import SidebarCollapse from '@/components/sidebar_collapse';
import ChatArea from '@/components/chat_area';

export default function ChatPage() {
  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Header fixo no topo */}
      <ChatHeader />
      
      {/* Layout principal com flexbox */}
      <div className="flex h-full" style={{ paddingTop: '80px' }}>
        {/* Sidebar fixa à esquerda */}
        <SidebarCollapse />
        
        {/* Área de chat à direita */}
        <ChatArea />
      </div>
    </div>
  );
}