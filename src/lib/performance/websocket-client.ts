import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketConfig {
  url: string;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  pingInterval?: number;
}

interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessage?: any;
  reconnectAttempts: number;
  error?: string;
}

export const useWebSocket = (_config: WebSocketConfig) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: 'disconnected',
    reconnectAttempts: 0
  });

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    setConnectionState(prev => ({ 
      ...prev, 
      status: 'connected' 
    }));
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    setConnectionState({
      status: 'disconnected',
      reconnectAttempts: 0
    });
  }, []);

  const send = useCallback((data: any) => {
    console.log('Mock WebSocket send:', data);
    return true;
  }, []);

  useEffect(() => {
    // Mock connection for demo
    const timer = setTimeout(() => {
      setConnectionState(prev => ({ 
        ...prev, 
        status: 'connected' 
      }));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    connectionState,
    connect,
    disconnect,
    send
  };
};