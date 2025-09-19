// ===================================================================
// SECURITY LAYER PERFORMANCE OPTIMIZATIONS
// ===================================================================

interface CachedToken {
  token: string;
  expiresAt: number;
}

interface SecurityOperation {
  operation: string;
  data: any;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timestamp: number;
}

// ===================================================================
// TOKEN MANAGEMENT OPTIMIZATION
// ===================================================================

export class OptimizedTokenManager {
  private tokenCache = new Map<string, CachedToken>();
  private refreshPromises = new Map<string, Promise<string>>();
  private readonly BUFFER_TIME = 300000; // 5 minutes buffer

  async getToken(key: string): Promise<string> {
    const cached = this.tokenCache.get(key);
    const now = Date.now();

    // Return cached token if still valid (with buffer)
    if (cached && cached.expiresAt > now + this.BUFFER_TIME) {
      return cached.token;
    }

    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromises.has(key)) {
      return this.refreshPromises.get(key)!;
    }

    const refreshPromise = this.refreshTokenFromServer(key);
    this.refreshPromises.set(key, refreshPromise);

    try {
      const newToken = await refreshPromise;
      this.tokenCache.set(key, {
        token: newToken,
        expiresAt: now + 3600000 // 1 hour
      });
      return newToken;
    } finally {
      this.refreshPromises.delete(key);
    }
  }

  private async refreshTokenFromServer(key: string): Promise<string> {
    const response = await fetch('/api/auth/token/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenKey: key })
    });
    
    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const { token, expiresIn } = await response.json();
    return token;
  }

  clearToken(key: string): void {
    this.tokenCache.delete(key);
    this.refreshPromises.delete(key);
  }

  clearAllTokens(): void {
    this.tokenCache.clear();
    this.refreshPromises.clear();
  }

  // Get token info without triggering refresh
  getTokenInfo(key: string): { isValid: boolean; expiresIn: number } | null {
    const cached = this.tokenCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    const isValid = cached.expiresAt > now + this.BUFFER_TIME;
    const expiresIn = cached.expiresAt - now;

    return { isValid, expiresIn };
  }
}

// ===================================================================
// REQUEST BATCHING FOR SECURITY OPERATIONS
// ===================================================================

export class SecurityRequestBatcher {
  private batchQueue: SecurityOperation[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY = 50; // 50ms batching window
  private readonly MAX_BATCH_SIZE = 10;

  async batchSecurityOperation(operation: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.batchQueue.push({ 
        operation, 
        data, 
        resolve, 
        reject,
        timestamp: Date.now()
      });

      // Process immediately if batch is full
      if (this.batchQueue.length >= this.MAX_BATCH_SIZE) {
        this.processBatch();
        return;
      }

      // Set timeout for batch processing
      if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(() => {
          this.processBatch();
        }, this.BATCH_DELAY);
      }
    });
  }

  private async processBatch(): Promise<void> {
    if (this.batchQueue.length === 0) return;

    const currentBatch = [...this.batchQueue];
    this.batchQueue.length = 0;
    
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    try {
      const response = await fetch('/api/security/batch', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Batch-Size': currentBatch.length.toString()
        },
        body: JSON.stringify({
          operations: currentBatch.map(({ operation, data, timestamp }) => ({ 
            operation, 
            data, 
            timestamp 
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Batch request failed: ${response.status}`);
      }

      const results = await response.json();
      
      currentBatch.forEach((request, index) => {
        const result = results[index];
        if (result?.success) {
          request.resolve(result.data);
        } else {
          request.reject(new Error(result?.error || 'Unknown batch error'));
        }
      });
    } catch (error) {
      // Reject all requests in the batch
      currentBatch.forEach(request => {
        request.reject(error);
      });
    }
  }

  // Get current batch status
  getBatchStatus(): { queueSize: number; isProcessing: boolean } {
    return {
      queueSize: this.batchQueue.length,
      isProcessing: this.batchTimeout !== null
    };
  }

  // Force process current batch
  async forceProcessBatch(): Promise<void> {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
    await this.processBatch();
  }
}

// ===================================================================
// EFFICIENT PERMISSION CHECKING
// ===================================================================

type Permission = string;

export class OptimizedPermissionChecker {
  private permissionCache = new Map<string, boolean>();
  private cacheTimeout = 300000; // 5 minutes
  private cacheTimestamps = new Map<string, number>();

  hasPermission(userPermissions: Permission[], required: Permission): boolean {
    const cacheKey = `${userPermissions.sort().join(',')}-${required}`;
    const now = Date.now();
    
    // Check cache validity
    const timestamp = this.cacheTimestamps.get(cacheKey);
    if (timestamp && (now - timestamp) < this.cacheTimeout) {
      const cached = this.permissionCache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
    }

    // Calculate permission
    const hasPermission = this.calculatePermission(userPermissions, required);
    
    // Cache result
    this.setCachedPermission(cacheKey, hasPermission, now);
    
    return hasPermission;
  }

  private calculatePermission(userPermissions: Permission[], required: Permission): boolean {
    // Super admin has all permissions
    if (userPermissions.includes('super:all')) {
      return true;
    }

    // Check direct permission
    if (userPermissions.includes(required)) {
      return true;
    }

    // Check wildcard permissions
    const requiredParts = required.split(':');
    for (const userPerm of userPermissions) {
      if (userPerm.includes('*')) {
        const userParts = userPerm.split(':');
        let matches = true;
        
        for (let i = 0; i < Math.min(userParts.length, requiredParts.length); i++) {
          if (userParts[i] !== '*' && userParts[i] !== requiredParts[i]) {
            matches = false;
            break;
          }
        }
        
        if (matches) return true;
      }
    }

    return false;
  }

  private setCachedPermission(key: string, value: boolean, timestamp: number): void {
    this.permissionCache.set(key, value);
    this.cacheTimestamps.set(key, timestamp);
  }

  // Clear expired cache entries
  cleanupCache(): void {
    const now = Date.now();
    
    for (const [key, timestamp] of this.cacheTimestamps.entries()) {
      if (now - timestamp >= this.cacheTimeout) {
        this.permissionCache.delete(key);
        this.cacheTimestamps.delete(key);
      }
    }
  }

  // Clear all cache
  clearCache(): void {
    this.permissionCache.clear();
    this.cacheTimestamps.clear();
  }

  // Get cache statistics
  getCacheStats(): {
    size: number;
    hitRate: number;
    oldestEntry: number;
  } {
    const now = Date.now();
    let oldestTimestamp = now;
    
    for (const timestamp of this.cacheTimestamps.values()) {
      if (timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp;
      }
    }

    return {
      size: this.permissionCache.size,
      hitRate: 0, // Would need to track hits/misses for accurate calculation
      oldestEntry: now - oldestTimestamp
    };
  }
}

// ===================================================================
// SECURITY RATE LIMITING
// ===================================================================

interface RateLimitEntry {
  count: number;
  windowStart: number;
  blocked: boolean;
}

export class ClientSideRateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private readonly DEFAULT_WINDOW = 60000; // 1 minute
  private readonly DEFAULT_MAX_REQUESTS = 100;

  isAllowed(
    key: string, 
    maxRequests: number = this.DEFAULT_MAX_REQUESTS,
    windowMs: number = this.DEFAULT_WINDOW
  ): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || (now - entry.windowStart) >= windowMs) {
      // New window or first request
      this.limits.set(key, {
        count: 1,
        windowStart: now,
        blocked: false
      });
      return true;
    }

    if (entry.blocked) {
      return false;
    }

    entry.count++;

    if (entry.count > maxRequests) {
      entry.blocked = true;
      // Log rate limit exceeded
      console.warn(`Rate limit exceeded for key: ${key}`);
      return false;
    }

    return true;
  }

  // Get remaining requests in current window
  getRemainingRequests(key: string, maxRequests: number = this.DEFAULT_MAX_REQUESTS): number {
    const entry = this.limits.get(key);
    if (!entry) return maxRequests;
    
    return Math.max(0, maxRequests - entry.count);
  }

  // Clear rate limit for a key
  clearLimit(key: string): void {
    this.limits.delete(key);
  }

  // Get all active limits
  getActiveLimits(): Array<{ key: string; count: number; blocked: boolean }> {
    return Array.from(this.limits.entries()).map(([key, entry]) => ({
      key,
      count: entry.count,
      blocked: entry.blocked
    }));
  }
}

// ===================================================================
// SINGLETON INSTANCES
// ===================================================================

export const tokenManager = new OptimizedTokenManager();
export const securityBatcher = new SecurityRequestBatcher();
export const permissionChecker = new OptimizedPermissionChecker();
export const rateLimiter = new ClientSideRateLimiter();

// Cleanup interval for permission cache
setInterval(() => {
  permissionChecker.cleanupCache();
}, 300000); // Clean up every 5 minutes

export default {
  OptimizedTokenManager,
  SecurityRequestBatcher,
  OptimizedPermissionChecker,
  ClientSideRateLimiter,
  tokenManager,
  securityBatcher,
  permissionChecker,
  rateLimiter
};