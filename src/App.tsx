import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Joyride, { STATUS, ACTIONS } from 'react-joyride';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { KeywordAnalytics } from './pages/KeywordAnalytics';
import { Loader } from './components/Loader';
import { useComplaints } from './hooks/useComplaints';
import { useTutorial } from './hooks/useTutorial';

function AppContent({ complaints }: { complaints: any[] }) {
  const {
    runTutorial,
    stepIndex,
    tutorialSteps,
    setStepIndex,
    startTutorial,
    stopTutorial,
    completeTutorial,
  } = useTutorial();

  const handleJoyrideCallback = (data: any) => {
    const { status, action, index, type } = data;

    // Handle tour completion
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      completeTutorial();
      return;
    }

    // Handle step changes
    if (type === 'step:after') {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }

    // Handle ESC key or close button
    if (action === ACTIONS.CLOSE) {
      stopTutorial();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F7] overflow-hidden">
      <Header complaints={complaints} onStartTutorial={startTutorial} isTourRunning={runTutorial} />

      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard complaints={complaints} />} />
          <Route path="/analytics" element={<KeywordAnalytics complaints={complaints} />} />
        </Routes>
      </div>

      {/* Joyride Tutorial */}
      <Joyride
        steps={tutorialSteps}
        run={runTutorial}
        stepIndex={stepIndex}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep
        disableOverlayClose
        spotlightPadding={8}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Finish',
          next: 'Next',
          skip: 'Skip Tour',
        }}
      />
    </div>
  );
}

function App() {
  const { complaints, isLoading } = useComplaints();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <AppContent complaints={complaints} />
    </BrowserRouter>
  );
}

export default App;
