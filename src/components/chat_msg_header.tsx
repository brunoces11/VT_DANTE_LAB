import React from 'react';
import { Scale } from 'lucide-react';

export default function ChatMsgHeader() {
  return (
    <div className="flex flex-row items-center justify-between p-4 border-b border-neutral-200 bg-white">
      <div className="flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
          <Scale className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Registro de Imóveis
          </h3>
        </div>
      </div>
    </div>
  );
}