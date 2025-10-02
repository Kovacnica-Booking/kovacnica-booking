import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  tabIndex?: number;
}

export function NumberInput({ value, onChange, error, tabIndex = 0 }: NumberInputProps) {
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  useEffect(() => {
    // Focus first input on mount if tabIndex is provided
    if (tabIndex && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [tabIndex]);

  const handleInput = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return;

    // Handle clearing and starting new input
    if (error && index === 0) {
      onChange('');
      // Use requestAnimationFrame to ensure state is updated before setting the new value
      requestAnimationFrame(() => {
        const newValue = inputValue.slice(-1);
        onChange(newValue);
        if (newValue) {
          inputRefs[1].current?.focus();
        }
      });
      return;
    }

    const newValue = value.split('');
    newValue[index] = inputValue.slice(-1);
    const finalValue = newValue.join('');
    onChange(finalValue);

    // Move focus to next input
    if (inputValue && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (value[index]) {
        // Clear current digit
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0) {
        // Move focus to previous input if current is empty
        inputRefs[index - 1].current?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      e.preventDefault();
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^\d]/g, '').slice(0, 4);
    onChange(pastedData);
    
    // Focus appropriate input
    const focusIndex = Math.min(pastedData.length, 3);
    inputRefs[focusIndex].current?.focus();
  };

  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "relative flex h-12 w-[3.25rem] items-center justify-center bg-[#333333] text-white transition-colors rounded-lg",
            error && "ring-1 ring-red-500",
            "hover:ring-1 hover:ring-gray-500",
            "focus-within:ring-2 focus-within:ring-white"
          )}
        >
          <input
            ref={inputRefs[i]}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={value[i] || ''}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={handleFocus}
            onPaste={handlePaste}
            className="w-full h-full bg-transparent text-center focus:outline-none rounded-lg"
            tabIndex={tabIndex}
            aria-label={`PIN digit ${i + 1}`}
          />
        </div>
      ))}
    </div>
  );
}