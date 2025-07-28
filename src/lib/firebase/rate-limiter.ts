// Simple client-side rate limiter for auth attempts
// For production, implement server-side rate limiting with Firebase Functions

interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

export class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly blockDurationMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000, blockDurationMs: number = 30 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
    
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('authRateLimits');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          this.storage = new Map(Object.entries(data));
        } catch (e) {
          console.error('Failed to load rate limit data:', e);
        }
      }
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      const data: Record<string, RateLimitEntry> = {};
      this.storage.forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem('authRateLimits', JSON.stringify(data));
    }
  }

  isBlocked(identifier: string): { blocked: boolean; remainingTime?: number } {
    const entry = this.storage.get(identifier);
    
    if (!entry) {
      return { blocked: false };
    }

    const now = Date.now();

    // Check if blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      return {
        blocked: true,
        remainingTime: Math.ceil((entry.blockedUntil - now) / 1000),
      };
    }

    // Check if outside time window (reset attempts)
    if (now - entry.lastAttempt > this.windowMs) {
      this.storage.delete(identifier);
      this.save();
      return { blocked: false };
    }

    return { blocked: false };
  }

  recordAttempt(identifier: string, success: boolean): { blocked: boolean; remainingAttempts?: number } {
    const now = Date.now();
    let entry = this.storage.get(identifier);

    if (!entry) {
      entry = {
        attempts: 0,
        lastAttempt: now,
      };
    }

    // Reset if outside window
    if (now - entry.lastAttempt > this.windowMs) {
      entry.attempts = 0;
    }

    // If successful, reset attempts
    if (success) {
      this.storage.delete(identifier);
      this.save();
      return { blocked: false };
    }

    // Increment failed attempts
    entry.attempts++;
    entry.lastAttempt = now;

    // Block if max attempts reached
    if (entry.attempts >= this.maxAttempts) {
      entry.blockedUntil = now + this.blockDurationMs;
      this.storage.set(identifier, entry);
      this.save();
      return { blocked: true };
    }

    this.storage.set(identifier, entry);
    this.save();

    return {
      blocked: false,
      remainingAttempts: this.maxAttempts - entry.attempts,
    };
  }

  getRemainingAttempts(identifier: string): number {
    const entry = this.storage.get(identifier);
    if (!entry) return this.maxAttempts;
    
    const now = Date.now();
    if (now - entry.lastAttempt > this.windowMs) {
      return this.maxAttempts;
    }
    
    return Math.max(0, this.maxAttempts - entry.attempts);
  }

  clear() {
    this.storage.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authRateLimits');
    }
  }
}

// Export singleton instance
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000, 30 * 60 * 1000);

// Helper function to get rate limit key
export function getRateLimitKey(type: 'email' | 'ip', value: string): string {
  return `${type}:${value}`;
}

// Helper function to format remaining time
export function formatRemainingTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  } else {
    const hours = Math.ceil(seconds / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
}