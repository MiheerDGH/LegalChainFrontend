import React, { useState, useRef, useEffect } from 'react';

type SearchableSelectProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Search...',
  label,
  required = false,
  disabled = false,
  className = '',
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block font-medium mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={`w-full border border-gray-300 px-3 py-2 rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete="off"
        />

        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && !disabled && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-gray-500 text-sm">No matches found</li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  index === highlightedIndex
                    ? 'bg-blue-100'
                    : option === value
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
