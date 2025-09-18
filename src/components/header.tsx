import React from 'react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Menu, X, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthModal from '@/components/auth/AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLabDropdownOpen, setIsLabDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLabDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.relative')) {
          setIsLabDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLabDropdownOpen]);

  const handleChatClick = () => {
    console.log('User state:', user); // Debug log
    if (user) {
      console.log('User is logged in, navigating to chat'); // Debug log
      navigate('/chat-page');
    } else {
      console.log('User not logged in, opening auth modal'); // Debug log
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
                <div className="relative">
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
                // Avatar do usuário logado
                <div className="flex items-center">
                  <div 
                    className="w-9 h-9 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors"
                    style={{
                      boxShadow: '0 0 0 2px white, 0 4px 7px rgba(0, 0, 0, 0.115)'
                    }}
                    title={user.email || 'Usuário logado'}
                  >
                    <User className="h-5 w-5 text-neutral-600" />
                  </div>
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
                      console.log('Chat button clicked, user:', user);
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
                  // Avatar do usuário logado no mobile
                  <div className="flex justify-center pt-4 border-t border-neutral-200">
                    <div 
                      className="w-9 h-9 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center"
                      style={{
                        boxShadow: '0 0 0 2px white, 0 4px 7px rgba(0, 0, 0, 0.115)'
                      }}
                      title={user.email || 'Usuário logado'}
                    >
                      <User className="h-5 w-5 text-neutral-600" />
                    </div>
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
    </>
  );
}