import React from 'react';

export default function ChatSidebar() {
  return (
    <aside className="w-[350px] h-screen bg-amber-50 border-r border-amber-100 flex-shrink-0">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Conversas
        </h2>
        
        {/* Placeholder para lista de conversas */}
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-25 cursor-pointer">
            <p className="text-sm font-medium text-neutral-900">Nova Conversa</p>
            <p className="text-xs text-neutral-600 mt-1">Clique para iniciar</p>
          </div>
          
          <div className="p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-25 cursor-pointer">
            <p className="text-sm font-medium text-neutral-900">Registro de Matrícula</p>
            <p className="text-xs text-neutral-600 mt-1">Há 2 horas</p>
          </div>
          
          <div className="p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-25 cursor-pointer">
            <p className="text-sm font-medium text-neutral-900">Qualificação Registral</p>
            <p className="text-xs text-neutral-600 mt-1">Ontem</p>
          </div>
        </div>
      </div>
    </aside>
  );
}