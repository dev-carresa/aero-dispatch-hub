
import { Session } from '@supabase/supabase-js';

// Constants
const SESSION_KEY = 'supabase.auth.session';
const TOKEN_KEY = 'supabase.auth.token';

/**
 * Store the session in local storage
 */
export const storeSession = (session: Session): void => {
  if (typeof window !== 'undefined' && session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    if (session.access_token) {
      localStorage.setItem(TOKEN_KEY, session.access_token);
    }
  }
};

/**
 * Get the stored session from local storage
 */
export const getStoredSession = (): Session | null => {
  if (typeof window !== 'undefined') {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  }
  return null;
};

/**
 * Get the stored token from local storage
 */
export const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Check if there is a stored session
 */
export const hasStoredSession = (): boolean => {
  return !!getStoredSession();
};

/**
 * Clear the stored session and token
 */
export const clearStoredSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
};
