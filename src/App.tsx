
import React, { useState, useEffect } from 'react';
import { Sun, Moon, HelpCircle, Clock } from 'lucide-react';
import { AppStep } from './types';
import { PermissionsPage } from './components/PermissionsPage';
import { VerificationPage } from './components/VerificationPage';
import { PromptGenerator } from './components/PromptGenerator';
import { InstructionsModal } from './components/InstructionsModal';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('verification');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showInstructions, setShowInstructions] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAccessGranted = (days: number) => {
    setDaysRemaining(days);
    setStep('app');
  };

  const renderContent = () => {
    switch (step) {
      case 'verification':
        return (
          <VerificationPage 
            onSuccess={() => setStep('permissions')} 
            onFail={() => setStep('locked')} 
          />
        );
      case 'permissions':
        return <PermissionsPage onSuccess={handleAccessGranted} />;
      case 'app':
        return <PromptGenerator />;
      case 'locked':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Maximum verification attempts reached. Please refresh the page to try again.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-sas-blue text-white rounded-lg hover:bg-blue-900 transition"
            >
              Refresh Page
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sas-yellow selection:text-sas-blue">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-sas-light/80 dark:bg-slate-900/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-center h-24">
            {/* Title Section - Centered */}
            <div className="flex flex-col items-center z-10 gap-1 md:gap-2">
              <span className="text-sm md:text-lg font-normal text-black dark:text-sas-gray leading-snug">
                The Simple AI Studio
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-sas-blue dark:text-blue-400 leading-tight text-center">
                Prompt Generator
              </h1>
            </div>

            {/* Controls - Absolute Right */}
            <div className="absolute right-0 flex items-center gap-2 md:gap-4">
              {/* Days Remaining Indicator - Only shown when logged in */}
              {daysRemaining !== null && step === 'app' && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-sas-yellow/20 dark:bg-yellow-900/20 text-sas-blue dark:text-sas-yellow rounded-full border border-sas-yellow/30 text-xs font-bold mr-2">
                  <Clock size={14} />
                  <span>{daysRemaining} days remaining</span>
                </div>
              )}

              <button
                onClick={() => setShowInstructions(true)}
                className="p-2 rounded-full text-sas-blue dark:text-sas-teal hover:bg-white/20 dark:hover:bg-slate-800 transition"
                title="Instructions"
              >
                <HelpCircle size={24} />
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-yellow-400 hover:bg-white/20 dark:hover:bg-slate-800 transition"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-sas-gray dark:text-slate-600">
        <p>&copy; {new Date().getFullYear()} The Simple AI Studio. All rights reserved.</p>
      </footer>

      {/* Modals */}
      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
      />
    </div>
  );
};

export default App;
