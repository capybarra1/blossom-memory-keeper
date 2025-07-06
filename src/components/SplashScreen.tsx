import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <img 
          src="/logo.png" 
          alt="Plantale Logo" 
          className="w-32 h-32 object-contain animate-pulse"
        />
        <h1 className="text-2xl font-bold text-green-600">Plantale</h1>
      </div>
    </div>
  );
};

export default SplashScreen;