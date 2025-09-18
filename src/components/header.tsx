import React from 'react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Menu, X, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthModal from '@/components/auth/AuthModal';
import PainelUsuario from '@/components/painel_usuario';
import UserAvatar from '@/components/ui/user-avatar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLabDropdownOpen, setIsLabDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPainelUsuarioOpen, setIsPainelUsuarioOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Close lab dropdown if clicking outside
      if (isLabDropdownOpen && !target.closest('.lab-dropdown')) {
        setIsLabDropdownOpen(false);
      }
      
      // Close user dropdown if clicking outside
      if (isUserDropdownOpen && !target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isLabDropdownOpen || isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLabDropdownOpen, isUserDropdownOpen]);

  const handleChatClick = () => {
    if (user) {
      navigate('/chat-page');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    // Após login bem-sucedido, redirecionar para o chat
    setIsAuthModalOpen(false);
    navigate('/chat-page');
  };

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
      <header className="fixed top-0 left-0 right-0 z-[9999] bg-white/85 backdrop-blur-[5px] border-b border-neutral-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#3D1413' }}>
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-neutral-900">Dante-IA</span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex items-center space-x-5">
                <button
                  onClick={() => navigate('/como-funciona')}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-neutral-100 ${
                    location.pathname === '/como-funciona' 
                      ? 'text-orange-700' 
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Como funciona
                </button>
                <span className="text-amber-900">|</span>
                <button
                  onClick={() => navigate('/base-legal')}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-neutral-100 ${
                    location.pathname === '/base-legal' 
                      ? 'text-orange-700' 
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Base Legal
                </button>
                <span className="text-amber-900">|</span>
                <button
                  onClick={() => navigate('/planos')}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-neutral-100 ${
                    location.pathname === '/planos' 
                      ? 'text-orange-700' 
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Planos
                </button>
                <span className="text-amber-900">|</span>
                <button
                  onClick={() => navigate('/contato')}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-neutral-100 ${
                    location.pathname === '/contato' 
                      ? 'text-orange-700' 
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Contato
                </button>
                <span className="text-amber-900">|</span>
                <div className="relative lab-dropdown">
                  <button
                    onClick={() => setIsLabDropdownOpen(!isLabDropdownOpen)}
                    className={`flex items-center text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-neutral-100 ${
                      location.pathname === '/chat-page' || location.pathname === '/dante-ui'
                        ? 'text-orange-700' 
                        : 'text-neutral-700 hover:text-neutral-900'
                    }`}
                  >
                    Lab
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {isLabDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setIsLabDropdownOpen(false);
                          navigate('/chat-page');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        Chat page
                      </button>
                      <button
                        onClick={() => {
                          setIsLabDropdownOpen(false);
                          navigate('/dante-ui');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        Dante UI
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                // Dropdown do usuário logado
                <div className="relative user-dropdown">
                  <UserAvatar 
                    size="md"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  />
                  
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
              ) : (
                // Botões para usuários não logados
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLoginClick}
                    className="text-neutral-700 border-neutral-300 hover:bg-neutral-50"
                  >
                    Entrar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      handleChatClick();
                    }}
                    className="bg-orange-700 hover:bg-orange-600 text-white"
                  >
                    💬 Iniciar Chat
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-neutral-200 pt-4 pb-4">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/como-funciona');
                  }}
                  className={`text-sm font-medium text-left px-3 py-2 rounded-md transition-colors w-full hover:bg-neutral-100 ${
                    location.pathname === '/como-funciona' 
                      ? 'text-orange-700' 
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Como funciona
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/base-legal');
                  }}
                  className={`text-sm font-medium text-left px-3 py-2 rounded-md transition-colors w-full hover:bg-neutral-100 ${
                    location.pathname === '/base-legal' 
                      ? 'text-orange-700' 
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Base Legal
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/planos');
                  }}
                  className={`text-sm font-medium text-left px-3 py-2 rounded-md transition-colors w-full hover:bg-neutral-100 ${
                    location.pathname === '/planos' 
                      ? 'text-orange-700' 
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Planos
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/contato');
                  }}
                  className={`text-sm font-medium text-left px-3 py-2 rounded-md transition-colors w-full hover:bg-neutral-100 ${
                    location.pathname === '/contato' 
                      ? 'text-orange-700' 
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Contato
                </button>
                <div>
                  <button
                    onClick={() => setIsLabDropdownOpen(!isLabDropdownOpen)}
                    className={`flex items-center text-sm font-medium w-full text-left hover:text-neutral-900 ${
                      location.pathname === '/chat-page' || location.pathname === '/dante-ui'
                        ? 'text-orange-700' 
                        : 'text-neutral-700'
                    }`}
                  >
                    Lab
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {isLabDropdownOpen && (
                    <div className="mt-2 ml-4">
                      <button
                        onClick={() => {
                          setIsLabDropdownOpen(false);
                          setIsMenuOpen(false);
                          navigate('/chat-page');
                        }}
                        className="text-neutral-600 hover:text-neutral-900 text-sm font-medium"
                      >
                        Chat page
                      </button>
                      <button
                        onClick={() => {
                          setIsLabDropdownOpen(false);
                          setIsMenuOpen(false);
                          navigate('/dante-ui');
                        }}
                        className="text-neutral-600 hover:text-neutral-900 text-sm font-medium"
                      >
                        Dante UI
                      </button>
                    </div>
                  )}
                </div>
                {user ? (
                  // Opções do usuário logado no mobile
                  <div className="pt-4 border-t border-neutral-200 space-y-2">
                    <div className="flex justify-center mb-4">
                      <UserAvatar size="lg" onClick={() => {}} showTooltip={true} />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        handlePainelUsuario();
                      }}
                      className="w-full text-neutral-700 border-neutral-300 flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Painel do Usuário</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-red-600 border-red-300 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </Button>
                  </div>
                ) : (
                  // Botões para usuários não logados no mobile
                  <div className="flex flex-col space-y-2 pt-4 border-t border-neutral-200">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLoginClick}
                      className="w-full text-neutral-700 border-neutral-300"
                    >
                      Entrar
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleChatClick}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      💬 Iniciar Chat
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      
      <PainelUsuario 
        isOpen={isPainelUsuarioOpen}
        onClose={() => setIsPainelUsuarioOpen(false)}
      />
    </>
  );
}