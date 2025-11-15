import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthModal from '@/components/auth/AuthModal';
import UserProfileIcon from '@/components/user_profile_icon';
import { useUserRole } from '@/hooks/useUserRole';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLabDropdownOpen, setIsLabDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const role = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const labDropdownRef = useRef<HTMLDivElement>(null);
  const labDropdownMobileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isLabDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Verifica se o clique foi fora do dropdown desktop OU mobile
      const clickedOutsideDesktop = labDropdownRef.current && !labDropdownRef.current.contains(target);
      const clickedOutsideMobile = labDropdownMobileRef.current && !labDropdownMobileRef.current.contains(target);
      
      // Fecha se clicou fora de ambos (ou se a ref não existe)
      if (clickedOutsideDesktop || clickedOutsideMobile) {
        setIsLabDropdownOpen(false);
      }
    };

    // Pequeno delay para evitar fechar imediatamente após abrir
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLabDropdownOpen]);

  const handleChatClick = () => {
    if (user) {
      navigate('/chat-page', { state: { startWelcome: true } });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = async () => {
    console.log('🎯 [Header] Login bem-sucedido, aguardando dados...');
    setIsAuthModalOpen(false);
    
    // Aguardar um pouco para garantir que o AuthProvider atualizou
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('🎯 [Header] Redirecionando para chat...');
    navigate('/chat-page', { state: { startWelcome: true } });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] bg-white/85 backdrop-blur-[5px] border-b border-neutral-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center ml-[25px]">
              <button
                onClick={() => navigate('/')}
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="./assets/DANTE_IA_LOGO_LIGHT_MODE.svg"
                  alt="Dante-IA"
                  className="h-[46px] w-auto"
                />
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
                {/* TEMPORARIAMENTE OCULTO - SERÁ REATIVADO POSTERIORMENTE */}
                {/* <span className="text-amber-900">|</span>
                <button
                  onClick={() => navigate('/planos')}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-neutral-100 ${
                    location.pathname === '/planos'
                      ? 'text-orange-700'
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Planos
                </button> */}
                {/* TEMPORARIAMENTE OCULTO - SERÁ REATIVADO POSTERIORMENTE */}
                {/* <span className="text-amber-900">|</span>
                <button
                  onClick={() => navigate('/contato')}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-neutral-100 ${
                    location.pathname === '/contato' 
                      ? 'text-orange-700' 
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Contato
                </button> */}
                {role === 'sadmin' && (
                  <>
                    <span className="text-amber-900">|</span>
                    <div className="relative" ref={labDropdownRef}>
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
                        <button
                          onClick={() => {
                            setIsLabDropdownOpen(false);
                            navigate('/metabase');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          Monitor
                        </button>
                        <button
                          onClick={() => {
                            setIsLabDropdownOpen(false);
                            navigate('/payload-test');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          Payload Test
                        </button>
                      </div>
                    )}
                  </div>
                  </>
                )}
              </nav>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                size="sm" 
                onClick={handleChatClick}
                className="bg-orange-700 hover:bg-orange-600 text-white"
              >
                💬 Iniciar Chat
              </Button>
              {user ? (
                <UserProfileIcon size="md" />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoginClick}
                  className="bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 [&]:bg-white [&]:text-neutral-900"
                >
                  Entrar
                </Button>
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
                {/* TEMPORARIAMENTE OCULTO - SERÁ REATIVADO POSTERIORMENTE */}
                {/* <button
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
                </button> */}
                {/* TEMPORARIAMENTE OCULTO - SERÁ REATIVADO POSTERIORMENTE */}
                {/* <button
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
                </button> */}
                {role === 'sadmin' && (
                  <div ref={labDropdownMobileRef}>
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
                      <div className="mt-2 ml-4 flex flex-col space-y-2">
                        <button
                          onClick={() => {
                            setIsLabDropdownOpen(false);
                            setIsMenuOpen(false);
                            navigate('/chat-page');
                          }}
                          className="text-neutral-600 hover:text-neutral-900 text-sm font-medium text-left"
                        >
                          Chat page
                        </button>
                        <button
                          onClick={() => {
                            setIsLabDropdownOpen(false);
                            setIsMenuOpen(false);
                            navigate('/dante-ui');
                          }}
                          className="text-neutral-600 hover:text-neutral-900 text-sm font-medium text-left"
                        >
                          Dante UI
                        </button>
                        <button
                          onClick={() => {
                            setIsLabDropdownOpen(false);
                            setIsMenuOpen(false);
                            navigate('/metabase');
                          }}
                          className="text-neutral-600 hover:text-neutral-900 text-sm font-medium text-left"
                        >
                          Monitor
                        </button>
                        <button
                          onClick={() => {
                            setIsLabDropdownOpen(false);
                            setIsMenuOpen(false);
                            navigate('/payload-test');
                          }}
                          className="text-neutral-600 hover:text-neutral-900 text-sm font-medium text-left"
                        >
                          Payload Test
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col space-y-2 pt-4 border-t border-neutral-200">
                  <Button 
                    size="sm" 
                    onClick={handleChatClick}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    💬 Iniciar Chat
                  </Button>
                  {!user && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoginClick}
                    className="w-full bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 [&]:bg-white [&]:text-neutral-900"
                  >
                    Entrar
                  </Button>
                  )}
                  {user && (
                    <div className="flex justify-center pt-2">
                      <UserProfileIcon size="md" showTooltip={true} />
                    </div>
                  )}
                </div>
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