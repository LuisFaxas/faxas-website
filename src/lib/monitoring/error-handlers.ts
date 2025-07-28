import { logger } from './logger';
import { toast } from '@/components/ui/toast';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  context?: Record<string, any>;
  fallbackMessage?: string;
}

/**
 * Handle API errors consistently
 */
export function handleApiError(
  error: unknown,
  operation: string,
  options: ErrorHandlerOptions = {}
): void {
  const {
    showToast = true,
    context = {},
    fallbackMessage = 'An error occurred. Please try again.',
  } = options;

  // Extract error details
  let message = fallbackMessage;
  let statusCode: number | undefined;
  
  if (error instanceof Response) {
    statusCode = error.status;
    message = getHttpErrorMessage(statusCode);
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Log the error
  logger.error(`API Error: ${operation}`, error, {
    operation,
    statusCode,
    ...context,
  });

  // Show user-friendly toast
  if (showToast) {
    toast.error('Request Failed', message);
  }
}

/**
 * Handle Firebase errors
 */
export function handleFirebaseError(
  error: unknown,
  operation: string,
  options: ErrorHandlerOptions = {}
): void {
  const {
    showToast = true,
    context = {},
  } = options;

  let message = 'An error occurred with our database.';
  let code: string | undefined;

  // Parse Firebase error
  if (error && typeof error === 'object' && 'code' in error) {
    code = String(error.code);
    message = getFirebaseErrorMessage(code);
  }

  // Log the error
  logger.error(`Firebase Error: ${operation}`, error, {
    operation,
    firebaseCode: code,
    ...context,
  });

  // Show user-friendly toast
  if (showToast) {
    toast.error('Database Error', message);
  }
}

/**
 * Handle form validation errors
 */
export function handleValidationError(
  errors: Record<string, string[]>,
  options: ErrorHandlerOptions = {}
): void {
  const { showToast = true } = options;

  // Log validation errors
  logger.warn('Form validation failed', {
    errors,
    fieldCount: Object.keys(errors).length,
  });

  // Show first error in toast
  if (showToast) {
    const firstError = Object.values(errors)[0]?.[0];
    if (firstError) {
      toast.error('Validation Error', firstError);
    }
  }
}

/**
 * Handle authentication errors
 */
export function handleAuthError(
  error: unknown,
  operation: string,
  options: ErrorHandlerOptions = {}
): void {
  const {
    showToast = true,
    context = {},
  } = options;

  let message = 'Authentication failed. Please try again.';
  
  // Parse auth-specific errors
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String(error.code);
    message = getAuthErrorMessage(code);
  }

  // Log the error
  logger.error(`Auth Error: ${operation}`, error, {
    operation,
    ...context,
  });

  // Show user-friendly toast
  if (showToast) {
    toast.error('Authentication Error', message);
  }
}

/**
 * Get user-friendly HTTP error messages
 */
function getHttpErrorMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'You need to be logged in to do that.',
    403: 'You don\'t have permission to access this resource.',
    404: 'The requested resource was not found.',
    429: 'Too many requests. Please slow down.',
    500: 'Server error. Please try again later.',
    502: 'Server is temporarily unavailable.',
    503: 'Service is currently offline.',
  };

  return messages[statusCode] || `Request failed with status ${statusCode}`;
}

/**
 * Get user-friendly Firebase error messages
 */
function getFirebaseErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'permission-denied': 'You don\'t have permission to perform this action.',
    'not-found': 'The requested data was not found.',
    'already-exists': 'This item already exists.',
    'resource-exhausted': 'Quota exceeded. Please try again later.',
    'failed-precondition': 'Operation failed. Please check your data.',
    'aborted': 'Operation was cancelled.',
    'out-of-range': 'Operation is out of valid range.',
    'unimplemented': 'This feature is not yet available.',
    'internal': 'Internal error. Please try again.',
    'unavailable': 'Service temporarily unavailable.',
    'data-loss': 'Data loss detected. Please contact support.',
    'unauthenticated': 'You need to be logged in.',
  };

  return messages[code] || 'An unexpected error occurred.';
}

/**
 * Get user-friendly auth error messages
 */
function getAuthErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/invalid-credential': 'Invalid login credentials.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email.',
  };

  return messages[code] || 'Authentication failed. Please try again.';
}

/**
 * Async error wrapper for consistent error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string,
  options: ErrorHandlerOptions = {}
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    handleApiError(error, operationName, options);
    return null;
  }
}