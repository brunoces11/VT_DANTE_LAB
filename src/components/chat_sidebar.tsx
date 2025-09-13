import React from 'react';

export default function ChatSidebar() {
  return (
    <aside className="w-[350px] bg-white border-r border-gray-200 flex-shrink-0 flex flex-col" style={{ height: 'calc(100vh - 90px)' }}>
      <div className="p-6 overflow-y-auto flex-1 sidebar-scrollbar">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Conversas
        </h2>
        
        {/* Lista de conversas com scroll quando necessário */}
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-25 cursor-pointer">
            <p className="text-sm font-medium text-neutral-900">Conversa Ativa</p>
            <p className="text-xs text-neutral-600 mt-1">Agora</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer">
            <p className="text-sm font-medium text-neutral-900">Nova Conversa</p>
            <p className="text-xs text-neutral-600 mt-1">Clique para iniciar</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer">
            <p className="text-sm font-medium text-neutral-900">Registro de Matrícula</p>
            <p className="text-xs text-neutral-600 mt-1">Há 2 horas</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer">
            <p className="text-sm font-medium text-neutral-900">Qualificação Registral</p>
            <p className="text-xs text-neutral-600 mt-1">Ontem</p>
          </div>
          
          {/* Adicionar mais itens para testar o scroll */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer">
              <p className="text-sm font-medium text-neutral-900">Conversa {i + 4}</p>
              <p className="text-xs text-neutral-600 mt-1">Há {i + 1} dias</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}