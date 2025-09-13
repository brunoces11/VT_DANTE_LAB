import React from 'react';
import { Brain } from 'lucide-react';

export default function ChatHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[100px] w-full bg-gray-100 border-b border-gray-200">
      <div className="flex items-center h-full px-6">
        {/* Logo no canto esquerdo */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-neutral-900">Dante-IA</span>
            <span className="text-sm text-neutral-600">Registro de Imóveis</span>
          </div>
        </div>
      </div>
    </header>
  );
}