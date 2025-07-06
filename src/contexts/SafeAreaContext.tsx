import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SafeAreaContextType {
  safeAreaColor: string;
  setSafeAreaColor: (color: string) => void;
}

const SafeAreaContext = createContext<SafeAreaContextType | undefined>(undefined);

export const SafeAreaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [safeAreaColor, setSafeAreaColor] = useState('#75B798'); // 默认绿色

  return (
    <SafeAreaContext.Provider value={{ safeAreaColor, setSafeAreaColor }}>
      {children}
    </SafeAreaContext.Provider>
  );
};

export const useSafeArea = () => {
  const context = useContext(SafeAreaContext);
  if (context === undefined) {
    throw new Error('useSafeArea must be used within a SafeAreaProvider');
  }
  return context;
};