import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B] pointer-events-none">
        <Search className="w-4.5 h-4.5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search messages, customers, locations..."
        className="input w-full pl-11 pr-11"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F] transition-colors p-1.5 rounded-lg hover:bg-[#F5F5F7]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
