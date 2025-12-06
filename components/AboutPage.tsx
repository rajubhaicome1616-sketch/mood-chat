
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg inline-block mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">MoodChat Pro</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Made by <a href="#" className="font-semibold text-blue-500 hover:underline">rajubhai000hacker</a>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          This app demonstrates powerful features using the Google Gemini API.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
