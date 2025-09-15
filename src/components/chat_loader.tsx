import React from 'react';
import { Home, Loader2 } from 'lucide-react';

interface ChatLoaderProps {
  loadingText?: string;
}

export default function ChatLoader({ loadingText = 'Processando...' }: ChatLoaderProps) {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3 max-w-[85%]">
        {/* Avatar */}
        <div 
          className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
          style={{ backgroundColor: '#B14627' }}
        >
          <Home className="h-4 w-4 text-white" />
        </div>

        {/* Conteúdo do loader */}
        <div className="rounded-lg p-3 bg-neutral-100 text-neutral-900 mb-[30px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">{loadingText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}