import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ToastProvider } from './context/ToastContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import { QuizProvider } from './context/QuizContext.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Navbar from './components/layout/Navbar.jsx';
import MobileNavigation from './components/layout/MobileNavigation.jsx';
import Footer from './components/layout/Footer.jsx';
import PageTransition from './components/layout/PageTransition.jsx';
import EmptyState from './components/ui/EmptyState.jsx';
import Button from './components/ui/Button.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Challenge from './pages/Challenge.jsx';
import Quiz from './pages/Quiz.jsx';
import Results from './pages/Results.jsx';
import Progress from './pages/Progress.jsx';
import Achievements from './pages/Achievements.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[LearnRush] Caught unexpected error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh bg-bg-app flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-soft text-center">
            <div
              className="w-16 h-16 rounded-2xl bg-peach-bg flex items-center justify-center text-3xl mx-auto mb-4"
              aria-hidden="true"
            >
              🛠️
            </div>
            <h1 className="text-2xl font-extrabold text-ink">
              Something went wrong
            </h1>
            <p className="text-sm sm:text-base text-body mt-2">
              An unexpected error occurred. Your saved progress is safe — click below to reload LearnRush.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = '/';
                }}
              >
                Reload LearnRush
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function NotFoundPage() {
  return (
    <div className="my-10 max-w-xl mx-auto">
      <h1 className="sr-only">Page Not Found</h1>
      <EmptyState
        emoji="🧭"
        title="Oops! You wandered off the map"
        message="We couldn't find that page, but plenty of learning challenges are waiting for you on the Dashboard."
        actionLabel="Back to Dashboard"
        actionTo="/"
      />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-dvh flex flex-col bg-bg-app text-body overflow-x-hidden">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-ink focus:text-white focus:font-extrabold focus:shadow-lg"
      >
        Skip to main content
      </a>

      <ScrollToTop />
      <Sidebar />

      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <Navbar />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12 focus:outline-none"
        >
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/challenge" element={<Challenge />} />
                <Route path="/quiz/:subject" element={<Quiz />} />
                <Route path="/results" element={<Results />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      <MobileNavigation />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <ProgressProvider>
            <QuizProvider>
              <AppShell />
            </QuizProvider>
          </ProgressProvider>
        </ToastProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
