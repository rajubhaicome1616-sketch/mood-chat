
import React from 'react';

interface SmartReplyProps {
  replies: string[];
  onSelectReply: (reply: string) => void;
}

export const SmartReply: React.FC<SmartReplyProps> = ({ replies, onSelectReply }) => {
  if (replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {replies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onSelectReply(reply)}
          className="px-3 py-1.5 text-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};
