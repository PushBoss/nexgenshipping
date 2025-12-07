import { supabase } from './supabaseClient';
import type { PostgrestError } from '@jsr/supabase__supabase-js';

/**
 * Middleware for handling Supabase errors consistently
 */
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string,
    public hint?: string
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

/**
 * Parse Supabase PostgrestError into a user-friendly format
 */
export function parseSupabaseError(error: PostgrestError): SupabaseError {
  return new SupabaseError(
    error.message || 'An unexpected error occurred',
    error.code,
    error.details,
    error.hint
  );
}

/**
 * Middleware to handle authentication state changes
 */
export function setupAuthListener(
  onAuthChange: (userId: string | null) => void
) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 Auth state changed:', event, session?.user?.id);
    onAuthChange(session?.user?.id || null);
  });

  return subscription;
}

/**
 * Middleware to check if user is authenticated
 */
export async function requireAuth(): Promise<string> {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    throw parseSupabaseError(error as unknown as PostgrestError);
  }
  
  if (!session?.user) {
    throw new SupabaseError('Authentication required', 'AUTH_REQUIRED');
  }
  
  return session.user.id;
}

/**
 * Middleware to handle RLS policy errors
 */
export function handleRLSError(error: PostgrestError): never {
  if (error.code === 'PGRST301' || error.message.includes('row-level security')) {
    throw new SupabaseError(
      'You do not have permission to perform this action',
      'PERMISSION_DENIED',
      'Row-level security policy violation'
    );
  }
  throw parseSupabaseError(error);
}

/**
 * Retry middleware for transient failures
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry auth or permission errors
      if (error instanceof SupabaseError && 
          (error.code === 'AUTH_REQUIRED' || error.code === 'PERMISSION_DENIED')) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError!;
}

/**
 * Rate limiting middleware (client-side)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Validate request with rate limiting
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 60,
  windowMs: number = 60000
): void {
  if (!rateLimiter.canMakeRequest(key, maxRequests, windowMs)) {
    throw new SupabaseError(
      'Too many requests. Please try again later.',
      'RATE_LIMIT_EXCEEDED'
    );
  }
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

/**
 * Validate file uploads
 */
export function validateFileUpload(
  file: File,
  maxSizeBytes: number = 5 * 1024 * 1024, // 5MB default
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
): void {
  if (file.size > maxSizeBytes) {
    throw new SupabaseError(
      `File size exceeds ${maxSizeBytes / 1024 / 1024}MB limit`,
      'FILE_TOO_LARGE'
    );
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new SupabaseError(
      `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      'INVALID_FILE_TYPE'
    );
  }
}
