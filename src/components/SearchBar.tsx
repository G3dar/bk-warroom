import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B] group-focus-within:text-[#007AFF] transition-colors pointer-events-none">
        <Search className="w-5 h-5 stroke-[2.5]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search messages, customers, locations..."
        className="w-full pl-12 pr-12 py-3.5 text-[15px] rounded-xl border-2 border-[#E5E5E5] bg-white text-[#1D1D1F] placeholder:text-[#C7C7CC] font-medium transition-all focus:outline-none focus:border-[#007AFF] focus:ring-4 focus:ring-blue-50 hover:border-[#007AFF]/30"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F] transition-all p-1.5 rounded-lg hover:bg-[#F5F5F7] active:scale-95"
        >
          <X className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
