import React from 'react';

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  isGrounded: boolean;
  setIsGrounded: (value: boolean) => void;
  isDirectMode: boolean;
  setIsDirectMode: (value: boolean) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ input, setInput, onSendMessage, isLoading, isGrounded, setIsGrounded, isDirectMode, setIsDirectMode }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      onSendMessage();
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-700 rounded-full shadow-lg">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isDirectMode ? "Direct prompt to Gemini..." : "Type a message or /imagine..."}
        className="w-full py-3 pl-20 pr-28 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
        disabled={isLoading}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
        <button
          onClick={() => setIsGrounded(!isGrounded)}
          title="Toggle Google Search"
          className={`w-6 h-6 rounded-full transition-colors ${isGrounded ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 m-auto ${isGrounded ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button
          onClick={() => setIsDirectMode(!isDirectMode)}
          title="Toggle Direct to Gemini Mode"
          className={`w-6 h-6 rounded-full transition-colors ${isDirectMode ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 m-auto ${isDirectMode ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
      <button
        onClick={onSendMessage}
        disabled={isLoading || !input.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full p-2.5 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-transform duration-200 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  );
};