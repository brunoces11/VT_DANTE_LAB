import React from 'react';
import { Settings, LogOut } from 'lucide-react';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPanel: () => void;
  onLogout: () => void;
  className?: string;
}

export default function UserDropdown({ 
  isOpen, 
  onClose, 
  onOpenPanel, 
  onLogout, 
  className = '' 
}: UserDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50 ${className}`}>
      <button
        onClick={onOpenPanel}
        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center space-x-2"
      >
        <Settings className="h-4 w-4" />
        <span>Painel do Usuário</span>
      </button>
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center space-x-2 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span>Sair</span>
      </button>
    </div>
  );
}