import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Home, ChevronDown, User } from 'lucide-react';

export default function ChatMsgHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Santa Catarina');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locations = ['Santa Catarina', 'Paraná', 'São Paulo', 'Mato Grosso'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-row items-center justify-between p-4 border-b border-neutral-200 bg-white h-14">
      <div className="flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#983C26' }}>
          <Home className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Registro de Imóveis
          </h3>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Dropdown de Localidade */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <span className="text-sm font-medium text-neutral-700">Localidade</span>
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                    selectedLocation === location 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-neutral-700'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Perfil do Usuário */}
        <div className="flex items-center space-x-3">
          {/* Informações do usuário */}
          <div className="text-right">
            <p className="text-sm font-medium" style={{ color: '#8B4513' }}>
              Juliana Luz
            </p>
            <p className="text-xs text-neutral-600">
              login: 9:45am
            </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Perfil do Usuário */}
        <div className="flex items-center space-x-3">
          {/* Informações do usuário */}
          <div className="text-right">
            <p className="text-sm font-medium" style={{ color: '#8B4513' }}>
              Juliana Luz
            </p>
            <p className="text-xs text-neutral-600">
              login: 9:45am
            </p>
          </div>
          
          {/* Avatar do usuário */}
          <button className="relative">
            <div 
              className="w-10 h-10 rounded-full bg-neutral-300 border-2 border-white flex items-center justify-center"
              style={{ 
                boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.1)' 
              }}
            >
              <User className="h-5 w-5 text-neutral-600" />
            </div>
          </button>
        </div>
          {/* Avatar do usuário */}
          <button className="relative">
            <div 
              className="w-10 h-10 rounded-full bg-neutral-300 border-2 border-white flex items-center justify-center"
              style={{ 
                boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.1)' 
              }}
            >
              <User className="h-5 w-5 text-neutral-600" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}