import React, { useState, useRef, useEffect } from 'react';
import './MultiDropdownSelect.scss';
import type { DropdownOption, MultiDropdownSelectProps } from './types';

const MultiDropdownSelect: React.FC<MultiDropdownSelectProps> = ({
  options,
  selectedKeys,
  onSelectionChange,
  onAddNewItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchAddInputValue, setSearchAddInputValue] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newOptions = options.filter((option: DropdownOption) =>
      option.value.toLowerCase().includes(searchAddInputValue.toLowerCase())
    );
    setFilteredOptions(newOptions);
  }, [searchAddInputValue, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchAddInputValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const onDropdownClick = () => {
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const selectedOptions = selectedKeys.map(key => options.find(option => option.key === key));

  const toggleOption = (optionKey: string) => {
    const newSelection = selectedKeys.includes(optionKey)
      ? selectedKeys.filter(key => key !== optionKey)
      : [...selectedKeys, optionKey];

    onSelectionChange(newSelection);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchAddInputValue.trim()) {
      e.preventDefault();
      const existingOption = options.find(option =>
        option.value.toLowerCase() === searchAddInputValue.toLowerCase()
      );
      if (existingOption) {
        return;
      }
      addNewOption();
    }
  };

  const addNewOption = () => {
    const newKey = `key-${Date.now()}`;
    onAddNewItem?.(searchAddInputValue.trim());
    onSelectionChange([...selectedKeys, newKey]);
    setSearchAddInputValue('');
  }

  const removeOption = (e: React.MouseEvent<HTMLButtonElement>, option: DropdownOption) => {
    e.stopPropagation();
    toggleOption(option.key);
  }

  const closeDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen) {
      e.stopPropagation();
      setIsOpen(false);
      setSearchAddInputValue('');
    }
  };

  return (
    <div className="multi-dropdown-select" ref={dropdownRef}>
      <div
        className={`selected-wrapper ${isOpen ? 'open' : ''}`}
        onClick={onDropdownClick}
      >
        <div className="selected-options">
          {selectedOptions.map(option => (
            <span key={option?.key} className="selected-option">
              {option?.value}
              <button
                className="remove-option"
                onClick={(e) => removeOption(e, option!)}>
                ×
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            type="text"
            className="search-add-input"
            placeholder={options.length === 0 ? "Type to add..." : "Type to search or add..."}
            value={searchAddInputValue}
            onChange={(e) => setSearchAddInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
        </div>
        <div className={`arrow-icon ${isOpen ? "open" : ""}`} onClick={closeDropdown}>
          <svg fill="#8f9299" height="12px" width="12px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 407.437 407.437">
            <polygon points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815 " />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="options">
            {filteredOptions.map(option => (
              <div
                key={option.key}
                className={`option ${selectedKeys.includes(option.key) ? 'selected' : ''}`}
                onClick={() => toggleOption(option.key)}
              >
                <span className="option-value">{option.value}</span>
                {selectedKeys.includes(option.key) && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="18px" height="18px" fill='#596bc1'>
                    <path d="M 41.9375 8.625 C 41.273438 8.648438 40.664063 9 40.3125 9.5625 L 21.5 38.34375 L 9.3125 27.8125 C 8.789063 27.269531 8.003906 27.066406 7.28125 27.292969 C 6.5625 27.515625 6.027344 28.125 5.902344 28.867188 C 5.777344 29.613281 6.078125 30.363281 6.6875 30.8125 L 20.625 42.875 C 21.0625 43.246094 21.640625 43.410156 22.207031 43.328125 C 22.777344 43.242188 23.28125 42.917969 23.59375 42.4375 L 43.6875 11.75 C 44.117188 11.121094 44.152344 10.308594 43.78125 9.644531 C 43.410156 8.984375 42.695313 8.589844 41.9375 8.625 Z" />
                  </svg>
                )}
              </div>
            ))}

            {searchAddInputValue.trim() && !options.some(option =>
              option.value.toLowerCase() === searchAddInputValue.toLowerCase()
            ) && (
                <div
                  className="option"
                  onClick={addNewOption}
                >
                  <span className="option-value">Create "{searchAddInputValue}"</span>
                  <b className="add-icon">+</b>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiDropdownSelect;