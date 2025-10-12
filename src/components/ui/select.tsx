import * as React from 'react';
import { useFloating, autoUpdate, offset, flip, size, useListNavigation, useTypeahead, useClick, useDismiss, useRole, useInteractions, FloatingFocusManager, FloatingOverlay } from '@floating-ui/react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
  tabIndex?: number;
}

export function Select({ value, onChange, options, className, disabled, tabIndex = 0 }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(
    options.findIndex(option => option.value === value)
  );
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches);
  });

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: '256px'
          });
        }
      })
    ]
  });

  const listRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef(options.map(option => option.label));

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: setActiveIndex
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNav,
    typeahead
  ]);

  const selectedOption = options.find(option => option.value === value);

  const handleOptionClick = (e: React.MouseEvent, option: SelectOption, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!option.disabled) {
      onChange(option.value);
      setSelectedIndex(index);
      setIsOpen(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        disabled={disabled}
        tabIndex={tabIndex}
        onClick={handleButtonClick}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-lg bg-[#333333] px-3 text-left text-white transition-colors",
          "hover:ring-1 hover:ring-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-white",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span className="truncate">{selectedOption?.label || ''}</span>
        <ChevronDown
          size={16}
          className={cn(
            "text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <FloatingOverlay lockScroll={!isMobile} style={{ zIndex: 100 }}>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex: 100 }}
              {...getFloatingProps()}
              className="bg-[#333333] rounded-lg shadow-lg border border-gray-600 overflow-hidden"
            >
              <div className="overflow-y-auto max-h-64">
                {options.map((option, index) => (
                  <button
                    key={option.value}
                    ref={(node) => {
                      listRef.current[index] = node;
                    }}
                    {...getItemProps()}
                    onClick={(e) => handleOptionClick(e, option, index)}
                    disabled={option.disabled}
                    className={cn(
                      "w-full px-3 py-2 text-left transition-colors",
                      "hover:bg-[#333333]",
                      "focus:outline-none focus:bg-[#333333]",
                      option.value === value && "bg-blue-500/20 text-blue-400",
                      option.disabled && "opacity-50 cursor-not-allowed",
                      activeIndex === index && "bg-[#333333]"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  );
}