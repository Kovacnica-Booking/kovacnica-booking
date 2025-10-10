import { useEffect, useRef } from 'react';
import { useTabVisibility } from './useTabVisibility';

const REFRESH_INTERVAL = 5000;

export function useAutoRefresh(callback: () => void, enabled: boolean = true) {
  const isTabVisible = useTabVisibility();
  const callbackRef = useRef(callback);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || !isTabVisible) {
      return;
    }

    const intervalId = setInterval(async () => {
      if (isRefreshingRef.current) {
        return;
      }

      isRefreshingRef.current = true;
      try {
        await callbackRef.current();
      } finally {
        isRefreshingRef.current = false;
      }
    }, REFRESH_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, isTabVisible]);
}
