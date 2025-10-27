import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Home, ChevronDown } from 'lucide-react';

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
      
      {/* DROPDOWN LOCALIDADE - TEMPORARIAMENTE OCULTO */}
      {/* 
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
      */}
    </div>
  );
}