import { useEffect, useRef } from 'react';
import { List, type ListImperativeAPI } from 'react-window';
import { ComplaintCard } from './ComplaintCard';
import { SearchBar } from './SearchBar';
import type { ComplaintWithMetadata } from '../types/complaints';

interface ComplaintFeedProps {
  complaints: ComplaintWithMetadata[];
  selectedComplaint: ComplaintWithMetadata | null;
  onSelectComplaint: (complaint: ComplaintWithMetadata) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isFeedFocused: boolean;
  onFocusChange: (focused: boolean) => void;
}

export function ComplaintFeed({
  complaints,
  selectedComplaint,
  onSelectComplaint,
  searchQuery,
  onSearchChange,
  isFeedFocused,
  onFocusChange,
}: ComplaintFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedCardRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<ListImperativeAPI | null>(null);

  useEffect(() => {
    if (!isFeedFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!complaints.length) return;

      const currentIndex = complaints.findIndex((c) => c.id === selectedComplaint?.id);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < complaints.length - 1) {
            onSelectComplaint(complaints[currentIndex + 1]);
          } else if (currentIndex === -1) {
            onSelectComplaint(complaints[0]);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            onSelectComplaint(complaints[currentIndex - 1]);
          } else if (currentIndex === -1) {
            onSelectComplaint(complaints[complaints.length - 1]);
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (selectedComplaint) {
            onFocusChange(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [complaints, selectedComplaint, isFeedFocused, onSelectComplaint, onFocusChange]);

  // Scroll selected card into view
  useEffect(() => {
    if (selectedComplaint && isFeedFocused && listRef.current) {
      const index = complaints.findIndex((c) => c.id === selectedComplaint.id);
      if (index !== -1) {
        listRef.current.scrollToRow({ index, align: 'smart' });
      }
    }
  }, [selectedComplaint, isFeedFocused, complaints]);

  // Row renderer for virtualized list
  const Row = ({ index, style }: any) => {
    const complaint = complaints[index];
    return (
      <div style={style}>
        <div className="px-6 pb-2">
          <ComplaintCard
            complaint={complaint}
            isSelected={selectedComplaint?.id === complaint.id}
            onClick={() => onSelectComplaint(complaint)}
            isFocused={isFeedFocused && selectedComplaint?.id === complaint.id}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-[#F5F5F7] flex flex-col overflow-hidden"
      onClick={() => onFocusChange(true)}
    >
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="px-6 pt-6 pb-4">
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
          <div className="px-6">
            <div className="card p-12 text-center rounded-2xl">
              <div className="text-6xl mb-4">💬</div>
              <div className="text-[20px] text-[#1D1D1F] mb-2 font-semibold">No messages found</div>
              <div className="text-[15px] text-[#86868B]">Try adjusting your filters or search</div>
            </div>
          </div>
        ) : (
          <List
            listRef={listRef}
            defaultHeight={window.innerHeight - 250}
            rowCount={complaints.length}
            rowHeight={140}
            rowComponent={Row}
            className="scrollbar-thin"
          />
        )}
      </div>
    </div>
  );
}
