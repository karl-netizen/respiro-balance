import { useState, useEffect, createContext, useContext } from 'react';

interface NetworkContextType {
  isOnline: boolean;
  connectionError: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  connectionError: false
});

export const useNetworkStatus = () => useContext(NetworkContext);

export const NetworkStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionError(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionError(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline, connectionError }}>
      {children}
    </NetworkContext.Provider>
  );
};