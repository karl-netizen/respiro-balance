import React from 'react';

// ===================================================================
// REAL-TIME WEBSOCKET INTEGRATION
// ===================================================================

interface WebSocketMessage {
  type: string;
  payload: any;
  id?: string;
  timestamp: number;
}

interface WebSocketConfig {
  url: string;
  protocols?: string[];
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  heartbeatInterval?: number;
  messageTimeout?: number;
}

interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';
  lastConnected?: number;
  reconnectAttempts: number;
  latency?: number;
}

export class OptimizedWebSocketClient {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private eventListeners = new Map<string, Array<(data: any) => void>>();
  private connectionState: ConnectionState = {
    status: 'disconnected',
    reconnectAttempts: 0
  };
  private heartbeatTimer?: NodeJS.Timeout;
  private reconnectTimer?: NodeJS.Timeout;
  private messageQueue: WebSocketMessage[] = [];
  private pendingMessages = new Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }>();

  constructor(config: WebSocketConfig) {
    this.config = {
      protocols: [],
      maxReconnectAttempts: 5,
      reconnectDelay: 1000,
      heartbeatInterval: 30000,
      messageTimeout: 10000,
      ...config
    };
  }

  // Connect to WebSocket server
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.connectionState.status = 'connecting';
        this.emit('statusChange', this.connectionState);

        const wsUrl = token ? `${this.config.url}?token=${token}` : this.config.url;
        this.ws = new WebSocket(wsUrl, this.config.protocols);

        const onOpen = () => {
          console.log('WebSocket connected');
          this.connectionState = {
            status: 'connected',
            lastConnected: Date.now(),
            reconnectAttempts: 0
          };
          
          this.emit('statusChange', this.connectionState);
        this.emit('connected', {});
          
          resolve();
          
          // Clean up event listeners
          this.ws!.removeEventListener('open', onOpen);
          this.ws!.removeEventListener('error', onError);
        };

        const onError = (error: Event) => {
          console.error('WebSocket connection error:', error);
          this.connectionState.status = 'error';
          this.emit('statusChange', this.connectionState);
          
          reject(new Error('WebSocket connection failed'));
          
          // Clean up event listeners
          this.ws!.removeEventListener('open', onOpen);
          this.ws!.removeEventListener('error', onError);
        };

        this.ws.addEventListener('open', onOpen);
        this.ws.addEventListener('error', onError);
        
        this.ws.addEventListener('message', this.handleMessage.bind(this));
        this.ws.addEventListener('close', this.handleClose.bind(this));
        
      } catch (error) {
        this.connectionState.status = 'error';
        this.emit('statusChange', this.connectionState);
        reject(error);
      }
    });
  }

  // Send message with optional response handling
  send(type: string, payload: any, expectResponse: boolean = false): Promise<any> {
    const message: WebSocketMessage = {
      type,
      payload,
      id: expectResponse ? this.generateMessageId() : undefined,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      if (this.connectionState.status !== 'connected') {
        // Queue message for when connection is established
        this.messageQueue.push(message);
        if (!expectResponse) {
          resolve(undefined);
          return;
        }
      }

      if (expectResponse && message.id) {
        // Set up response handler
        const timeout = setTimeout(() => {
          this.pendingMessages.delete(message.id!);
          reject(new Error(`Message timeout: ${type}`));
        }, this.config.messageTimeout);

        this.pendingMessages.set(message.id, { resolve, reject, timeout });
      }

      try {
        this.ws!.send(JSON.stringify(message));
        
        if (!expectResponse) {
          resolve(undefined);
        }
      } catch (error) {
        if (expectResponse && message.id) {
          const pending = this.pendingMessages.get(message.id);
          if (pending) {
            clearTimeout(pending.timeout);
            this.pendingMessages.delete(message.id);
          }
        }
        reject(error);
      }
    });
  }

  // Subscribe to message type
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    
    this.eventListeners.get(event)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  // Emit event to listeners
  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          if (data !== undefined) {
            callback(data);
          } else {
            callback();
          }
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  // Handle incoming messages
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // Handle response to pending message
      if (message.id && this.pendingMessages.has(message.id)) {
        const pending = this.pendingMessages.get(message.id)!;
        clearTimeout(pending.timeout);
        this.pendingMessages.delete(message.id);
        pending.resolve(message.payload);
        return;
      }

      // Handle heartbeat pong
      if (message.type === 'pong') {
        const latency = Date.now() - message.timestamp;
        this.connectionState.latency = latency;
        this.emit('statusChange', this.connectionState);
        return;
      }

      // Emit message to type-specific listeners
      this.emit(message.type, message.payload);
      
      // Emit to generic message listeners
      this.emit('message', message);
      
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
      this.emit('error', error);
    }
  }

  // Handle connection close
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket disconnected:', event.code, event.reason);
    
    this.stopHeartbeat();
    this.connectionState.status = 'disconnected';
    this.emit('statusChange', this.connectionState);
    this.emit('disconnected', { code: event.code, reason: event.reason });
    
    // Reject pending messages
    for (const [id, pending] of this.pendingMessages) {
      clearTimeout(pending.timeout);
      pending.reject(new Error('Connection closed'));
    }
    this.pendingMessages.clear();
    
    // Attempt reconnection if not manually closed
    if (event.code !== 1000 && this.connectionState.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.attemptReconnect();
    }
  }

  // Attempt to reconnect
  private attemptReconnect(): void {
    if (this.connectionState.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    this.connectionState.reconnectAttempts++;
    this.connectionState.status = 'reconnecting';
    this.emit('statusChange', this.connectionState);
    
    const delay = this.config.reconnectDelay * Math.pow(2, this.connectionState.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect (${this.connectionState.reconnectAttempts}/${this.config.maxReconnectAttempts}) in ${delay}ms`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
        this.attemptReconnect();
      });
    }, delay);
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.connectionState.status === 'connected') {
        this.send('ping', { timestamp: Date.now() });
      }
    }, this.config.heartbeatInterval);
  }

  // Stop heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  // Process queued messages
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      try {
        this.ws!.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send queued message:', error);
        // Re-queue message at the front
        this.messageQueue.unshift(message);
        break;
      }
    }
  }

  // Generate unique message ID
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get connection status
  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  // Check if connected
  isConnected(): boolean {
    return this.connectionState.status === 'connected';
  }

  // Get queued message count
  getQueuedMessageCount(): number {
    return this.messageQueue.length;
  }

  // Manually disconnect
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.connectionState = {
      status: 'disconnected',
      reconnectAttempts: 0
    };
    
    this.emit('statusChange', this.connectionState);
  }

  // Force reconnect
  reconnect(): Promise<void> {
    this.disconnect();
    this.connectionState.reconnectAttempts = 0;
    return this.connect();
  }
}

// React hook for WebSocket integration
export const useWebSocket = (config: WebSocketConfig, token?: string) => {
  const [client] = React.useState(() => new OptimizedWebSocketClient(config));
  const [connectionState, setConnectionState] = React.useState<ConnectionState>({
    status: 'disconnected',
    reconnectAttempts: 0
  });

  React.useEffect(() => {
    const unsubscribe = client.on('statusChange', setConnectionState);
    
    if (token) {
      client.connect(token).catch(error => {
        console.error('WebSocket connection failed:', error);
      });
    }

    return () => {
      unsubscribe();
      client.disconnect();
    };
  }, [client, token]);

  const send = React.useCallback((type: string, payload: any, expectResponse?: boolean) => {
    return client.send(type, payload, expectResponse);
  }, [client]);

  const subscribe = React.useCallback((event: string, callback: (data: any) => void) => {
    return client.on(event, callback);
  }, [client]);

  return {
    connectionState,
    isConnected: connectionState.status === 'connected',
    send,
    subscribe,
    reconnect: client.reconnect.bind(client),
    disconnect: client.disconnect.bind(client)
  };
};

export default OptimizedWebSocketClient;
