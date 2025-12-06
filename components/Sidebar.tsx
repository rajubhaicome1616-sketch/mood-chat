
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

// FIX: Changed icon type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const NavItem: React.FC<{
  icon: React.ReactElement;
  label: View;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const ChatIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm1.5 1a.5.5 0 000 1h9a.5.5 0 000-1h-9zM3.5 9a.5.5 0 000 1h5a.5.5 0 000-1h-5z" />
    </svg>
  );

  const LiveIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 017 8a1 1 0 10-2 0 7.001 7.001 0 006 6.93V17H9a1 1 0 100 2h2a1 1 0 100-2h-1v-2.07z" clipRule="evenodd" />
    </svg>
  );

  const CommunityIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
  );

  const AboutIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
  )

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
        </div>
        <h1 className="ml-3 text-xl font-bold text-gray-800 dark:text-white">MoodChat Pro</h1>
      </div>
      <nav className="space-y-2 flex-grow">
        <NavItem
          icon={ChatIcon}
          label={View.CHAT}
          isActive={currentView === View.CHAT}
          onClick={() => setCurrentView(View.CHAT)}
        />
        <NavItem
          icon={LiveIcon}
          label={View.LIVE}
          isActive={currentView === View.LIVE}
          onClick={() => setCurrentView(View.LIVE)}
        />
        <NavItem
          icon={CommunityIcon}
          label={View.COMMUNITY}
          isActive={currentView === View.COMMUNITY}
          onClick={() => setCurrentView(View.COMMUNITY)}
        />
      </nav>
       <nav>
          <NavItem
              icon={AboutIcon}
              label={View.ABOUT}
              isActive={currentView === View.ABOUT}
              onClick={() => setCurrentView(View.ABOUT)}
          />
       </nav>
    </aside>
  );
};
