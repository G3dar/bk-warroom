import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { KeywordAnalytics } from './pages/KeywordAnalytics';
import { useComplaints } from './hooks/useComplaints';

function App() {
  const { complaints } = useComplaints();

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-[#F5F5F7]">
        <Header complaints={complaints} />

        <Routes>
          <Route path="/" element={<Dashboard complaints={complaints} />} />
          <Route path="/analytics" element={<KeywordAnalytics complaints={complaints} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
