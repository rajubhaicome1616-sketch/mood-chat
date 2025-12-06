
import React from 'react';

const BannerAd: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center text-center">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p className="font-bold">Advertisement</p>
        <p className="text-xs">AdMob Banner Ad Placeholder (ca-app-pub-8210628921339980/4154069289)</p>
      </div>
    </div>
  );
};

export default BannerAd;