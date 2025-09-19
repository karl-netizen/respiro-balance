import React from 'react';

// ===================================================================
// MEMORY MANAGEMENT & CLEANUP PATTERNS
// ===================================================================

interface CleanupFunction {
  (): void;
}

interface ResourceTracker {
  id: string;
  type: string;
  createdAt: number;
  cleanup: CleanupFunction;
}

// ===================================================================
// MEMORY LEAK PREVENTION
// ===================================================================

export class MemoryManager {
  private static instance: MemoryManager;
  private resources = new Map<string, ResourceTracker>();
  private cleanupInterval?: NodeJS.Timeout;
  private memoryCheckInterval?: NodeJS.Timeout;
  private listeners: Array<(usage: MemoryInfo) => void> = [];

  private constructor() {
    this.startMemoryMonitoring();
    this.startPeriodicCleanup();
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  // Register a resource for tracking
  registerResource(
    id: string,
    type: string,
    cleanup: CleanupFunction
  ): void {
    this.resources.set(id, {
      id,
      type,
      createdAt: Date.now(),
      cleanup
    });
  }

  // Unregister and cleanup a resource
  unregisterResource(id: string): void {
    const resource = this.resources.get(id);
    if (resource) {
      try {
        resource.cleanup();
      } catch (error) {
        console.error(`Failed to cleanup resource ${id}:`, error);
      }
      this.resources.delete(id);
    }
  }

  // Get resource statistics
  getResourceStats(): {
    total: number;
    byType: Record<string, number>;
    oldestResource: { id: string; age: number } | null;
  } {
    const byType: Record<string, number> = {};
    let oldestResource: { id: string; age: number } | null = null;
    const now = Date.now();

    for (const resource of this.resources.values()) {
      byType[resource.type] = (byType[resource.type] || 0) + 1;
      
      const age = now - resource.createdAt;
      if (!oldestResource || age > oldestResource.age) {
        oldestResource = { id: resource.id, age };
      }
    }

    return {
      total: this.resources.size,
      byType,
      oldestResource
    };
  }

  // Cleanup old resources (older than specified time)
  cleanupOldResources(maxAge: number = 3600000): void { // 1 hour default
    const now = Date.now();
    const toCleanup: string[] = [];

    for (const [id, resource] of this.resources) {
      if (now - resource.createdAt > maxAge) {
        toCleanup.push(id);
      }
    }

    toCleanup.forEach(id => this.unregisterResource(id));
    
    if (toCleanup.length > 0) {
      console.log(`Cleaned up ${toCleanup.length} old resources`);
    }
  }

  // Force cleanup all resources
  cleanupAllResources(): void {
    const ids = Array.from(this.resources.keys());
    ids.forEach(id => this.unregisterResource(id));
    console.log(`Cleaned up ${ids.length} resources`);
  }

  private startMemoryMonitoring(): void {
    if (!(performance as any).memory) return;

    this.memoryCheckInterval = setInterval(() => {
      const memory = (performance as any).memory;
      const memoryInfo: MemoryInfo = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };

      // Notify listeners
      this.listeners.forEach(listener => {
        try {
          listener(memoryInfo);
        } catch (error) {
          console.error('Error in memory listener:', error);
        }
      });

      // Auto cleanup if memory usage is high
      if (memoryInfo.percentage > 85) {
        console.warn('High memory usage detected, cleaning up old resources');
        this.cleanupOldResources(1800000); // 30 minutes for high memory situations
      }
    }, 30000); // Check every 30 seconds
  }

  private startPeriodicCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldResources();
    }, 600000); // Cleanup every 10 minutes
  }

  // Subscribe to memory usage updates
  onMemoryUpdate(listener: (usage: MemoryInfo) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Get current memory usage
  getCurrentMemoryUsage(): MemoryInfo | null {
    if (!(performance as any).memory) return null;

    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }

  // Destroy the memory manager
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
    this.cleanupAllResources();
    this.listeners.length = 0;
  }
}

// ===================================================================
// REACT HOOKS FOR MEMORY MANAGEMENT
// ===================================================================

// Custom hook for cleanup effects
export const useCleanupEffect = (
  effect: () => CleanupFunction,
  deps: React.DependencyList
): void => {
  React.useEffect(() => {
    const cleanup = effect();
    return cleanup;
  }, deps);
};

// Hook for WebSocket with automatic cleanup
export const useWebSocketWithCleanup = (
  url: string, 
  token: string
): {
  socket: WebSocket | null;
  isConnected: boolean;
  send: (data: any) => void;
} => {
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const memoryManager = React.useMemo(() => MemoryManager.getInstance(), []);

  useCleanupEffect(() => {
    if (!token) return () => {};

    const ws = new WebSocket(`${url}?token=${token}`);
    const resourceId = `websocket-${Date.now()}-${Math.random()}`;
    
    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
      memoryManager.unregisterResource(resourceId);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    // Register for cleanup tracking
    memoryManager.registerResource(resourceId, 'websocket', () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      setSocket(null);
      setIsConnected(false);
    });

    return () => {
      memoryManager.unregisterResource(resourceId);
    };
  }, [token, url, memoryManager]);

  const send = React.useCallback((data: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(data));
    }
  }, [socket, isConnected]);

  return { socket, isConnected, send };
};

// Hook for EventListener with cleanup
export const useEventListenerWithCleanup = (
  target: EventTarget | null,
  eventType: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): void => {
  const memoryManager = React.useMemo(() => MemoryManager.getInstance(), []);

  useCleanupEffect(() => {
    if (!target) return () => {};

    const resourceId = `event-listener-${eventType}-${Date.now()}`;
    
    target.addEventListener(eventType, handler, options);

    memoryManager.registerResource(resourceId, 'event-listener', () => {
      target.removeEventListener(eventType, handler, options);
    });

    return () => {
      memoryManager.unregisterResource(resourceId);
    };
  }, [target, eventType, handler, options, memoryManager]);
};

// Hook for Intersection Observer with cleanup
export const useIntersectionObserverWithCleanup = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): [(node: Element | null) => void, IntersectionObserverEntry[]] => {
  const [entries, setEntries] = React.useState<IntersectionObserverEntry[]>([]);
  const [node, setNode] = React.useState<Element | null>(null);
  const memoryManager = React.useMemo(() => MemoryManager.getInstance(), []);

  useCleanupEffect(() => {
    if (!node) return () => {};

    const resourceId = `intersection-observer-${Date.now()}`;
    
    const observer = new IntersectionObserver((entries) => {
      setEntries(entries);
      callback(entries, observer);
    }, options);

    observer.observe(node);

    memoryManager.registerResource(resourceId, 'intersection-observer', () => {
      observer.disconnect();
      setEntries([]);
    });

    return () => {
      memoryManager.unregisterResource(resourceId);
    };
  }, [node, callback, options, memoryManager]);

  return [setNode, entries];
};

// Hook for memory usage monitoring
export const useMemoryMonitoring = (): {
  memoryUsage: MemoryInfo | null;
  resourceStats: ReturnType<MemoryManager['getResourceStats']>;
  isHighMemoryUsage: boolean;
} => {
  const [memoryUsage, setMemoryUsage] = React.useState<MemoryInfo | null>(null);
  const [resourceStats, setResourceStats] = React.useState(() => 
    MemoryManager.getInstance().getResourceStats()
  );
  const memoryManager = React.useMemo(() => MemoryManager.getInstance(), []);

  React.useEffect(() => {
    // Initial values
    setMemoryUsage(memoryManager.getCurrentMemoryUsage());
    setResourceStats(memoryManager.getResourceStats());

    // Subscribe to updates
    const unsubscribe = memoryManager.onMemoryUpdate((usage) => {
      setMemoryUsage(usage);
      setResourceStats(memoryManager.getResourceStats());
    });

    return unsubscribe;
  }, [memoryManager]);

  const isHighMemoryUsage = memoryUsage ? memoryUsage.percentage > 80 : false;

  return {
    memoryUsage,
    resourceStats,
    isHighMemoryUsage
  };
};

// ===================================================================
// TYPES
// ===================================================================

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  percentage: number;
}

// Export singleton instance
export const memoryManager = MemoryManager.getInstance();

export default {
  MemoryManager,
  useCleanupEffect,
  useWebSocketWithCleanup,
  useEventListenerWithCleanup,
  useIntersectionObserverWithCleanup,
  useMemoryMonitoring,
  memoryManager
};