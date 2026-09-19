import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ options = [], value, onChange, placeholder = 'Select option...', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options to objects { value, label }
  const formattedOptions = options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = formattedOptions.find(opt => opt.value === value) || formattedOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Custom Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 rounded-2xl bg-[#FFF7F9] border transition-all duration-200 flex items-center justify-between text-xs font-semibold cursor-pointer shadow-2xs ${
          isOpen 
            ? 'border-[#9D3158] ring-2 ring-[#9D3158]/20 bg-[#FFFDFB]' 
            : 'border-[#F7C9D5] hover:border-[#9D3158]'
        }`}
      >
        <span className="text-[#301B25] truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-[#9D3158] transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-[#70213F]' : ''
          }`} 
        />
      </button>

      {/* Luxury Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#FFFDFB] border border-[#F7C9D5] shadow-2xl rounded-2xl py-2 z-50 max-h-60 overflow-y-auto space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
          {formattedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#FFF7F9] text-[#9D3158] font-bold border-l-4 border-[#9D3158]'
                    : 'text-[#301B25] hover:bg-[#FFF7F9] hover:text-[#9D3158]'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#9D3158] shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
