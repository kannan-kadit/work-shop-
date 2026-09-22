import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  badge?: string;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: any) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  disabled?: boolean;
  id?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  disabled = false,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        setIsOpen(false);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      } else if (event.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < options.length) {
        event.preventDefault();
        const opt = options[highlightedIndex];
        if (!opt.disabled) {
          onChange(opt.value);
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, highlightedIndex, options, onChange]);

  const handleSelect = (val: string | number, optDisabled?: boolean) => {
    if (optDisabled || disabled) return;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative inline-block text-left w-full ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            const idx = options.findIndex((opt) => String(opt.value) === String(value));
            setHighlightedIndex(idx >= 0 ? idx : 0);
          }
        }}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm font-semibold rounded-lg border transition-all text-left focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
          disabled
            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            : 'bg-white text-black border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 shadow-sm'
        } ${buttonClassName}`}
        style={{ backgroundColor: disabled ? '#f1f5f9' : '#ffffff', color: disabled ? '#94a3b8' : '#000000' }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate text-black font-semibold">
          {selectedOption ? selectedOption.label : (
            <span className="text-slate-500 font-normal">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-black transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-amber-600' : 'text-slate-700'
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={listboxRef}
          className={`absolute left-0 right-0 z-[9999] mt-1.5 w-full min-w-[220px] bg-white border border-slate-300 rounded-xl shadow-2xl py-1.5 max-h-64 overflow-y-auto focus:outline-none ${dropdownClassName}`}
          role="listbox"
          style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#cbd5e1' }}
        >
          {options.map((option, idx) => {
            const isSelected = String(option.value) === String(value);
            const isHighlighted = idx === highlightedIndex;
            return (
              <div
                key={String(option.value)}
                onClick={() => handleSelect(option.value, option.disabled)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                role="option"
                aria-selected={isSelected}
                className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-b border-slate-100 last:border-b-0 ${
                  option.disabled
                    ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400'
                    : isSelected
                    ? 'bg-amber-100/70 text-black font-bold'
                    : isHighlighted
                    ? 'bg-amber-50 text-black'
                    : 'bg-white text-black hover:bg-amber-50 hover:text-black'
                }`}
                style={{
                  backgroundColor: option.disabled ? '#f8fafc' : isSelected ? '#fef3c7' : isHighlighted ? '#fffbeb' : '#ffffff',
                  color: option.disabled ? '#94a3b8' : '#000000'
                }}
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="truncate text-black font-semibold">{option.label}</span>
                  {option.sublabel && (
                    <span className="text-[10px] text-slate-600 font-normal truncate mt-0.5">
                      {option.sublabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {option.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200">
                      {option.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="w-4 h-4 text-amber-600 stroke-[2.5]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
