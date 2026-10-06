import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { TryPage } from './pages/TryPage';
import { ResearchPage } from './pages/ResearchPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { TeamPage } from './pages/TeamPage';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  const handleNavigateToTry = () => {
    setActiveTab('try');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToResearch = () => {
    setActiveTab('research');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Global Navigation Bar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <HomePage
              onNavigateToTry={handleNavigateToTry}
              onNavigateToResearch={handleNavigateToResearch}
            />
          )}
          {activeTab === 'try' && (
            <TryPage onNavigateToResearch={handleNavigateToResearch} />
          )}
          {activeTab === 'research' && (
            <ResearchPage onNavigateToTry={handleNavigateToTry} />
          )}
          {activeTab === 'datasets' && (
            <DatasetsPage onNavigateToTry={handleNavigateToTry} />
          )}
          {activeTab === 'team' && (
            <TeamPage onNavigateToTry={handleNavigateToTry} />
          )}
        </main>

        {/* Global Academic Footer */}
        <Footer setActiveTab={setActiveTab} />
      </div>
    </ThemeProvider>
  );
}

export default App;
