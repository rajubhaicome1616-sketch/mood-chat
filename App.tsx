
import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import LiveComponent from './components/LiveComponent';
import CommunityFeed from './components/CommunityFeed';
import AboutPage from './components/AboutPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import InterstitialAd from './components/InterstitialAd';
import { View } from './types';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.CHAT);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [interstitialShown, setInterstitialShown] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSetView = (view: View) => {
    // Show interstitial only once per session when navigating away from chat
    if (currentView === View.CHAT && view !== View.CHAT && !interstitialShown) {
      setShowInterstitial(true);
      setInterstitialShown(true);
      // Hide ad after 5 seconds
      setTimeout(() => {
        setShowInterstitial(false);
      }, 5000);
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case View.CHAT:
        return <ChatWindow />;
      case View.LIVE:
        return <LiveComponent />;
      case View.COMMUNITY:
        return <CommunityFeed />;
      case View.ABOUT:
        return <AboutPage />;
      default:
        return <ChatWindow />;
    }
  };

  return (
    <>
      <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
        <Sidebar currentView={currentView} setCurrentView={handleSetView} />
        <div className="flex flex-col flex-grow">
          <Header currentView={currentView} theme={theme} toggleTheme={toggleTheme} />
          <main className="flex-grow overflow-y-auto">
            {renderView()}
          </main>
        </div>
      </div>
      {showInterstitial && <InterstitialAd onClose={() => setShowInterstitial(false)} />}
    </>
  );
};

export default App;