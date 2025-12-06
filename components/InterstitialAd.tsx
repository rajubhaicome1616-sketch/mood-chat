
import React, { useState, useEffect } from 'react';

interface InterstitialAdProps {
  onClose: () => void;
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ onClose }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-white">
      <div className="absolute top-4 right-4">
        <button onClick={onClose} className="text-white text-2xl font-bold">&times;</button>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Advertisement</h2>
        <div className="w-80 h-60 bg-gray-500 flex items-center justify-center mb-4 p-4">
          <p className="text-white text-center">
            Ad Content Placeholder
            <br />
            <span className="text-xs text-gray-300">(ca-app-pub-8210628921339980/4154069289)</span>
          </p>
        </div>
        <p className="text-sm">
          {countdown > 0 ? `Ad will close in ${countdown}...` : 'You can close this ad now.'}
        </p>
      </div>
       <p className="absolute bottom-4 text-xs text-gray-400">This is a simulated ad for demonstration purposes.</p>
    </div>
  );
};

export default InterstitialAd;