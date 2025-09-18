import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import PainelUsuario from '@/components/painel_usuario';

export default function ChatHeader() {
  const navigate = useNavigate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isPainelUsuarioOpen, setIsPainelUsuarioOpen] = useState(false);
  const { user, profile, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Close user dropdown if clicking outside
      if (isUserDropdownOpen && !target.closest('.user-dropdown-chat')) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  const handlePainelUsuario = () => {
    setIsUserDropdownOpen(false);
    setIsPainelUsuarioOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 max-h-[60px] h-[60px] w-full bg-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between h-full pl-4 pr-6">
        {/* Logo no canto esquerdo */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="p-2 rounded-lg w-9 h-9" style={{ backgroundColor: '#3D1413' }}>
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-neutral-900">Dante-IA</span>
        </button>

          {/* Avatar do usuário no canto direito */}
          {user && (
            <div className="relative user-dropdown-chat">
              <div className="flex items-center">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors overflow-hidden"
                  style={{
                    boxShadow: '0 0 0 2px white, 0 4px 7px rgba(0, 0, 0, 0.115)'
                  }}
                  title={user.email || 'Usuário logado'}
                >
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-neutral-600" />
                  )}
                </button>
              </div>
              
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                  <button
                    onClick={handlePainelUsuario}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Painel do Usuário</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <PainelUsuario 
        isOpen={isPainelUsuarioOpen}
        onClose={() => setIsPainelUsuarioOpen(false)}
      />
    </>
  );
}