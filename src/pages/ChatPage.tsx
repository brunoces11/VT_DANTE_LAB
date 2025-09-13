import React from 'react';
import ChatHeader from '@/components/chat_header';
import ChatSidebar from '@/components/chat_sidebar';
import ChatArea from '@/components/chat_area';

export default function ChatPage() {
  const [firstMessageHandler, setFirstMessageHandler] = useState<((message: string) => void) | null>(null);

  const handleFirstMessageSetup = (chatId: string, handler: (message: string) => void) => {
    setFirstMessageHandler(() => handler);
  };

  const handleFirstMessage = (message: string) => {
    if (firstMessageHandler) {
      firstMessageHandler(message);
    }
  };

  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Header fixo no topo */}
      <ChatHeader />
      
      {/* Layout principal com flexbox */}
      <div className="flex h-full" style={{ paddingTop: '80px' }}>
        {/* Sidebar fixa à esquerda */}
        <ChatSidebar onFirstMessage={handleFirstMessageSetup} />
        
        {/* Área de chat à direita */}
        <ChatArea onFirstMessage={handleFirstMessage} />
      </div>
    </div>
  );
}