
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0"></div>
      )}
      <div className={`px-4 py-3 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg shadow-md ${
        isUser
          ? 'bg-blue-600 text-white rounded-br-none'
          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
      }`}>
        <p className="text-sm break-words">{message.text}</p>
        {message.imageUrl && (
            <img src={message.imageUrl} alt="Generated" className="mt-2 rounded-lg max-w-full h-auto" />
        )}
        {message.sources && message.sources.length > 0 && (
            <div className="mt-3 border-t border-gray-200 dark:border-gray-600 pt-2">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Sources:</h4>
                <ul className="space-y-1">
                    {message.sources.map((source, index) => (
                        <li key={index}>
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 dark:text-blue-400 hover:underline truncate">
                                {source.title || source.uri}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        <div className="text-xs mt-2 opacity-70 text-right">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};
