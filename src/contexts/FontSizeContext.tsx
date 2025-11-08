import React, { createContext, useContext } from 'react';

interface FontSizeContextType {
  fontSize: number;
}

const FontSizeContext = createContext<FontSizeContextType>({ fontSize: 100 });

export const useFontSize = () => useContext(FontSizeContext);

export const FontSizeProvider: React.FC<{ fontSize: number; children: React.ReactNode }> = ({ 
  fontSize, 
  children 
}) => {
  return (
    <FontSizeContext.Provider value={{ fontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};