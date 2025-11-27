import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ComplaintFeed } from './components/ComplaintFeed';
import { ConversationPanel } from './components/ConversationPanel';
import { useComplaints } from './hooks/useComplaints';
import type { ComplaintWithMetadata } from './types/complaints';
import { normalizeCategoryName } from './utils/formatters';

function App() {
  const { complaints, keywordsIndex } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintWithMetadata | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAnger, setSelectedAnger] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFeedFocused, setIsFeedFocused] = useState(true);

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

  // Sort complaints by timestamp (most recent first)
  const sortedComplaints = useMemo(() => {
    return [...filteredComplaints].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [filteredComplaints]);

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F7]">
      <Header complaints={complaints} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          complaints={complaints}
          keywordsIndex={keywordsIndex}
          selectedCategory={selectedCategory}
          selectedAnger={selectedAnger}
          selectedState={selectedState}
          selectedKeywords={selectedKeywords}
          onCategoryChange={setSelectedCategory}
          onAngerChange={setSelectedAnger}
          onStateChange={setSelectedState}
          onKeywordsChange={setSelectedKeywords}
        />

        <ComplaintFeed
          complaints={sortedComplaints}
          selectedComplaint={selectedComplaint}
          onSelectComplaint={setSelectedComplaint}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isFeedFocused={isFeedFocused}
          onFocusChange={setIsFeedFocused}
        />

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

export default App;
