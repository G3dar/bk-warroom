import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ComplaintFeed } from './components/ComplaintFeed';
import { ConversationPanel } from './components/ConversationPanel';
import { useComplaints } from './hooks/useComplaints';
import type { ComplaintWithMetadata } from './types/complaints';
import { normalizeCategoryName } from './utils/formatters';

function App() {
  const { complaints } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintWithMetadata | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAnger, setSelectedAnger] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
  }, [complaints, selectedCategory, selectedAnger, selectedState, searchQuery]);

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
          selectedCategory={selectedCategory}
          selectedAnger={selectedAnger}
          selectedState={selectedState}
          onCategoryChange={setSelectedCategory}
          onAngerChange={setSelectedAnger}
          onStateChange={setSelectedState}
        />

        <ComplaintFeed
          complaints={sortedComplaints}
          selectedComplaint={selectedComplaint}
          onSelectComplaint={setSelectedComplaint}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ConversationPanel
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      </div>
    </div>
  );
}

export default App;
