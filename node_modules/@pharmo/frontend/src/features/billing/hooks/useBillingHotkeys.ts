import { useEffect, useRef } from 'react';

interface HotkeyConfig {
  key: string;
  ctrlKey?: boolean;
  callback: () => void;
}

export const useBillingHotkeys = (configs: HotkeyConfig[]) => {
  const callbacksRef = useRef(configs);
  callbacksRef.current = configs;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      callbacksRef.current.forEach((cfg) => {
        const matchesKey = event.key.toLowerCase() === cfg.key.toLowerCase();
        const matchesCtrl = cfg.ctrlKey == null || event.ctrlKey === cfg.ctrlKey;

        if (matchesKey && matchesCtrl) {
          event.preventDefault();
          cfg.callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Stable effect - uses ref to avoid re-registering
};