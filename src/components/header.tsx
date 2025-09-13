import React from 'react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthModal from '@/components/auth/AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLabDropdownOpen, setIsLabDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    if (user) {
      navigate('/chat-principal');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    navigate('/chat-principal');
  };

  return (
    <>
      <header className="relative z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-neutral-900">Dante AI</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex space-x-8">
                <a href="#" className="text-neutral-700 hover:text-neutral-900 text-sm font-medium">
                  Agentes de IA
                </a>
                <a href="#" className="text-neutral-700 hover:text-neutral-900 text-sm font-medium">
                  Preços
                </a>
                <div className="relative">
                  <button
                    onClick={() => setIsLabDropdownOpen(!isLabDropdownOpen)}
                    className="flex items-center text-neutral-700 hover:text-neutral-900 text-sm font-medium"
                  >
                    Lab
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {isLabDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setIsLabDropdownOpen(false);
                          // Navigate to chat page or handle action
                          console.log('Chat page clicked');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        Chat page
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
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
                onClick={handleChatClick}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                💬 Iniciar Chat
              </Button>
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
                <a href="#" className="text-neutral-700 hover:text-neutral-900 text-sm font-medium">
                  Agentes de IA
                </a>
                <a href="#" className="text-neutral-700 hover:text-neutral-900 text-sm font-medium">
                  Preços
                </a>
                <div>
                  <button
                    onClick={() => setIsLabDropdownOpen(!isLabDropdownOpen)}
                    className="flex items-center text-neutral-700 hover:text-neutral-900 text-sm font-medium w-full text-left"
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
                          // Navigate to chat page or handle action
                          console.log('Chat page clicked');
                        }}
                        className="text-neutral-600 hover:text-neutral-900 text-sm font-medium"
                      >
                        Chat page
                      </button>
                    </div>
                  )}
                </div>
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
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    💬 Iniciar Chat
                  </Button>
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