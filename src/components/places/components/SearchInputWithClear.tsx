
import { Input } from '@/components/ui/input';
import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputWithClearProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onClear: () => void;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  inputRef: React.Ref<HTMLInputElement>;
}

export function SearchInputWithClear({
  value,
  onChange,
  onFocus,
  onClear,
  isLoading,
  placeholder,
  className,
  disabled,
  required,
  inputRef
}: SearchInputWithClearProps) {
  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        className={cn("pr-10", className)}
        disabled={disabled}
        required={required}
        autoComplete="off"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : value ? (
          <button
            type="button"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
            tabIndex={-1}
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
