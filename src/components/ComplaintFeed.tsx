import { ComplaintCard } from './ComplaintCard';
import { SearchBar } from './SearchBar';
import type { ComplaintWithMetadata } from '../types/complaints';

interface ComplaintFeedProps {
  complaints: ComplaintWithMetadata[];
  selectedComplaint: ComplaintWithMetadata | null;
  onSelectComplaint: (complaint: ComplaintWithMetadata) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ComplaintFeed({
  complaints,
  selectedComplaint,
  onSelectComplaint,
  searchQuery,
  onSearchChange,
}: ComplaintFeedProps) {
  return (
    <div className="flex-1 bg-[#F5F5F7] p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="text-[32px] font-black text-[#1D1D1F] leading-none tracking-tight">
              Messages
            </h2>
            <span className="text-[18px] font-bold text-[#007AFF] px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
              {complaints.length}
            </span>
          </div>
          <p className="text-[14px] text-[#86868B] font-medium mb-5">
            {complaints.length === 1 ? '1 conversation' : `${complaints.length} conversations`}
          </p>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        {complaints.length === 0 ? (
          <div className="card p-12 text-center rounded-2xl">
            <div className="text-6xl mb-4">💬</div>
            <div className="text-[20px] text-[#1D1D1F] mb-2 font-semibold">No messages found</div>
            <div className="text-[15px] text-[#86868B]">Try adjusting your filters or search</div>
          </div>
        ) : (
          <div className="space-y-2">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                isSelected={selectedComplaint?.id === complaint.id}
                onClick={() => onSelectComplaint(complaint)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
