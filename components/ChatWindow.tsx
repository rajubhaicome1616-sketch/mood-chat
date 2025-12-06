import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Mood } from '../types';
import { analyzeMood, getSmartReplies, getGroundedResponse, generateImage, getChatResponse, getEmojiSuggestions, getDirectResponse } from '../services/geminiService';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { SmartReply } from './SmartReply';
import { MoodSuggestions } from './MoodSuggestions';

const moodThemes: Record<Mood, string> = {
  [Mood.Neutral]: 'from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800',
  [Mood.Happy]: 'from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50',
  [Mood.Sad]: 'from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50',
  [Mood.Angry]: 'from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50',
};

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "नमस्ते! I'm your MoodChat assistant, an app by rajubhai. I'm not a real AI, but I can help with many things. How can I assist you today?", sender: 'bot', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<Mood>(Mood.Neutral);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [emojiSuggestions, setEmojiSuggestions] = useState<string[]>([]);
  const [isGrounded, setIsGrounded] = useState(false);
  const [isDirectMode, setIsDirectMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setSmartReplies([]);
    setEmojiSuggestions([]);
    setInput('');
    
    // Regex to catch identity questions in English and Hindi (with variations)
    const identityQueryRegex = /(who\s+are\s+you|are\s+you\s+(ai|robot)|(kya\s+tum|tum)\s+(ai|robot)\s+ho|((tumhara|tera|tmhara|ur)\s+(naam|name))\s+(kya|kia|what)\s*(h|hai|is)?)/i;
    
    const isIdentityQuery = identityQueryRegex.test(messageText);

    if (isIdentityQuery) {
        const cannedResponse: Message = {
            id: Date.now().toString(),
            text: "Main MoodeChat hoon, mujhe rajubhai ne banaya hai ❤️. Main AI jaisa behave karta hoon, par main ek smart app hoon, koi AI robot nahi.",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, cannedResponse]);
        
        const mood = await analyzeMood(messageText);
        setCurrentMood(mood);
        const replies = await getSmartReplies([...messages, userMessage, cannedResponse]);
        setSmartReplies(replies);

        setIsLoading(false);
        return;
    }

    try {
      let botResponse: Message;

      if (messageText.toLowerCase().startsWith('/imagine')) {
        const prompt = messageText.substring(8).trim();
        botResponse = await generateImage(prompt);
      } else if (isGrounded) {
        botResponse = await getGroundedResponse(messageText);
      } else if (isDirectMode) {
        botResponse = await getDirectResponse(messageText);
      } else {
        botResponse = await getChatResponse(messages, messageText);
      }
      
      setMessages(prev => [...prev, botResponse]);
      
      const mood = await analyzeMood(messageText);
      setCurrentMood(mood);
      
      const emojis = await getEmojiSuggestions(mood);
      setEmojiSuggestions(emojis);

      const replies = await getSmartReplies([...messages, userMessage, botResponse]);
      setSmartReplies(replies);

    } catch (error) {
      console.error('Error with Gemini API:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, I'm having trouble connecting. Please check your API key and try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
  };

  return (
    <div className={`flex flex-col h-full bg-gradient-to-br transition-colors duration-1000 ${moodThemes[currentMood]}`}>
      <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 max-w-lg">
                  <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 md:p-6 bg-transparent">
        <MoodSuggestions suggestions={emojiSuggestions} onSelectEmoji={handleSelectEmoji} />
        <SmartReply replies={smartReplies} onSelectReply={handleSendMessage} />
        <MessageInput
          input={input}
          setInput={setInput}
          isGrounded={isGrounded}
          setIsGrounded={setIsGrounded}
          isDirectMode={isDirectMode}
          setIsDirectMode={setIsDirectMode}
          onSendMessage={() => handleSendMessage(input)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatWindow;