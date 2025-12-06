
import React from 'react';

interface MoodSuggestionsProps {
  suggestions: string[];
  onSelectEmoji: (emoji: string) => void;
}

export const MoodSuggestions: React.FC<MoodSuggestionsProps> = ({ suggestions, onSelectEmoji }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-3 animate-fade-in">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mood Emojis:</p>
      <div className="flex gap-2 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm p-1.5 rounded-full border border-gray-300 dark:border-gray-600">
        {suggestions.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onSelectEmoji(emoji)}
            className="text-xl hover:scale-125 transition-transform duration-200"
          >
            {emoji}
          </button>
        ))}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
