import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { KeywordAnalytics } from './pages/KeywordAnalytics';
import { Loader } from './components/Loader';
import { useComplaints } from './hooks/useComplaints';

function App() {
  const { complaints, isLoading } = useComplaints();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-[#F5F5F7] overflow-hidden">
        <Header complaints={complaints} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard complaints={complaints} />} />
            <Route path="/analytics" element={<KeywordAnalytics complaints={complaints} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
