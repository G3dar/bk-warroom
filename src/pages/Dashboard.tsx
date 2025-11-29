import { useState, useMemo, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { ComplaintFeed } from '../components/ComplaintFeed';
import { ConversationPanel } from '../components/ConversationPanel';
import type { ComplaintWithMetadata } from '../types/complaints';
import { normalizeCategoryName } from '../utils/formatters';

interface DashboardProps {
  complaints: ComplaintWithMetadata[];
}

export function Dashboard({ complaints }: DashboardProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintWithMetadata | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAnger, setSelectedAnger] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFeedFocused, setIsFeedFocused] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [starredIds, setStarredIds] = useState<Set<number>>(() => {
    // Load starred IDs from localStorage
    const stored = localStorage.getItem('starredComplaints');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // Save starred IDs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('starredComplaints', JSON.stringify(Array.from(starredIds)));
  }, [starredIds]);

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      // Category filter
      if (selectedCategory && normalizeCategoryName(complaint.category) !== selectedCategory) {
        return false;
      }

      // Anger filter
      if (selectedAnger && complaint.anger.category !== selectedAnger) {
        return false;
      }

      // State filter
      if (selectedState && complaint.location.stateAbbr !== selectedState) {
        return false;
      }

      // Keyword filter (OR logic - complaint must have at least one selected keyword)
      if (selectedKeywords.length > 0) {
        const hasMatchingKeyword = selectedKeywords.some((selectedKeyword) =>
          complaint.keywords?.includes(selectedKeyword)
        );
        if (!hasMatchingKeyword) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = complaint.customer.name.toLowerCase().includes(query);
        const matchesMessage = complaint.thread.some((msg) =>
          msg.message.toLowerCase().includes(query)
        );
        const matchesLocation = complaint.location.city.toLowerCase().includes(query);

        if (!matchesName && !matchesMessage && !matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }, [complaints, selectedCategory, selectedAnger, selectedState, selectedKeywords, searchQuery]);

  // Sort complaints by starred status first, then timestamp (most recent first)
  const sortedComplaints = useMemo(() => {
    return [...filteredComplaints].sort((a, b) => {
      const aStarred = starredIds.has(a.id);
      const bStarred = starredIds.has(b.id);

      // Starred items come first
      if (aStarred && !bStarred) return -1;
      if (!aStarred && bStarred) return 1;

      // Otherwise sort by timestamp (most recent first)
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }, [filteredComplaints, starredIds]);

  // Handle keyword click - toggle keyword selection
  const handleKeywordClick = (keyword: string) => {
    setSelectedKeywords((prev) => {
      if (prev.includes(keyword)) {
        return prev.filter((k) => k !== keyword);
      } else {
        return [...prev, keyword];
      }
    });
  };

  // Handle star toggle
  const handleStarToggle = (id: number) => {
    setStarredIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="h-full flex overflow-hidden relative">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-[#007AFF] text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all hover:scale-110"
      >
        <Filter className="w-6 h-6" />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:relative
        z-50 lg:z-auto
        transition-transform duration-300 ease-in-out
        h-full
      `}>
        <Sidebar
          complaints={complaints}
          selectedCategory={selectedCategory}
          selectedAnger={selectedAnger}
          selectedState={selectedState}
          selectedKeywords={selectedKeywords}
          onCategoryChange={setSelectedCategory}
          onAngerChange={setSelectedAnger}
          onStateChange={setSelectedState}
          onKeywordsChange={setSelectedKeywords}
        />

        {/* Close button for mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg"
        >
          <X className="w-5 h-5 text-[#1D1D1F]" />
        </button>
      </div>

      <ComplaintFeed
        complaints={sortedComplaints}
        selectedComplaint={selectedComplaint}
        onSelectComplaint={setSelectedComplaint}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isFeedFocused={isFeedFocused}
        onFocusChange={setIsFeedFocused}
        onKeywordClick={handleKeywordClick}
        starredIds={starredIds}
        onStarToggle={handleStarToggle}
        selectedKeywords={selectedKeywords}
      />

      {/* ConversationPanel - hide on mobile when not selected */}
      <div className={`${selectedComplaint ? 'block' : 'hidden lg:block'}`}>
        <ConversationPanel
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          isFeedFocused={isFeedFocused}
          onFocusChange={setIsFeedFocused}
        />
      </div>
    </div>
  );
}
