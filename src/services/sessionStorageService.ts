
import { Session } from '@supabase/supabase-js';

// Constants
const SESSION_KEY = 'supabase.auth.session';
const TOKEN_KEY = 'supabase.auth.token';
const USER_KEY = 'user-session-data';
const EMAIL_REMEMBER_KEY = 'remembered-email';

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
 * Check if the stored session is still valid
 */
export const isSessionValid = (): boolean => {
  const session = getStoredSession();
  if (!session) return false;
  
  // Check if session has an expiry time
  if (session.expires_at) {
    // expires_at is in seconds, Date.now() is in milliseconds
    return session.expires_at * 1000 > Date.now();
  }
  
  return true;
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

/**
 * Store user data in local storage
 */
export const storeUserSession = (
  id: string,
  email: string,
  name: string,
  role: string,
  expiresIn: number
): void => {
  if (typeof window !== 'undefined') {
    const expiryTime = Date.now() + expiresIn * 1000;
    const userData = {
      id,
      email,
      name,
      role,
      expiryTime
    };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }
};

/**
 * Get user data from local storage
 */
export const getStoredUserData = () => {
  if (typeof window !== 'undefined') {
    const userDataStr = localStorage.getItem(USER_KEY);
    if (userDataStr) {
      return JSON.parse(userDataStr);
    }
  }
  return null;
};

/**
 * Clear user session data
 */
export const clearUserSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Store email for remember me functionality
 */
export const rememberUserEmail = (email: string, remember: boolean): void => {
  if (typeof window !== 'undefined') {
    if (remember) {
      localStorage.setItem(EMAIL_REMEMBER_KEY, email);
    } else {
      localStorage.removeItem(EMAIL_REMEMBER_KEY);
    }
  }
};

/**
 * Get remembered email
 */
export const getRememberedEmail = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(EMAIL_REMEMBER_KEY);
  }
  return null;
};

/**
 * Check if token should be refreshed
 */
export const shouldRefreshToken = (): boolean => {
  const session = getStoredSession();
  if (!session || !session.expires_at) return false;
  
  // Refresh if less than 5 minutes remaining (300 seconds)
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const fiveMinutesBeforeExpiry = session.expires_at - 300;
  
  return nowInSeconds >= fiveMinutesBeforeExpiry;
};

/**
 * Update the session expiry time
 */
export const updateSessionExpiry = (expiresIn: number): void => {
  const session = getStoredSession();
  if (!session) return;
  
  const updatedSession = {
    ...session,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn
  };
  
  storeSession(updatedSession);
};
