import React, { createContext, useContext, useState, useEffect } from 'react';

const VibeContext = createContext({
  vibe: 'night',
  setVibe: () => {},
  toggleVibe: () => {}
});

export function VibeProvider({ children }) {
  const [vibe, setVibe] = useState(() => {
    try {
      const saved = localStorage.getItem('garden_vibe');
      return saved ? saved : 'night';
    } catch {
      return 'night';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (vibe === 'day') {
      root.classList.add('day');
      root.classList.remove('dark');
    } else {
      root.classList.remove('day');
      root.classList.add('dark');
    }
    try {
      localStorage.setItem('garden_vibe', vibe);
    } catch {}
  }, [vibe]);

  const toggleVibe = () => {
    setVibe(prev => (prev === 'night' ? 'day' : 'night'));
  };

  return (
    <VibeContext.Provider value={{ vibe, setVibe, toggleVibe }}>
      {children}
    </VibeContext.Provider>
  );
}

export function useVibe() {
  return useContext(VibeContext);
}
