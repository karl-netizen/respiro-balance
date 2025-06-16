import { useState, useCallback, useRef } from 'react';

export const useStableState = <T>(initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  const stateRef = useRef<T>(state);
  
  // Keep ref in sync with state
  stateRef.current = state;
  
  const stableSetState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prevState => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prevState) : value;
      stateRef.current = newValue;
      return newValue;
    });
  }, []);
  
  const getStableState = useCallback(() => stateRef.current, []);
  
  return [state, stableSetState, getStableState] as const;
};
