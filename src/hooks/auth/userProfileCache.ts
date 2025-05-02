
import { AuthUser } from '@/types/auth';

// Cache to store previously fetched user data to improve performance
const userProfileCache = new Map<string, AuthUser>();

/**
 * Get a user from the cache by id
 */
export const getCachedUser = (userId: string): AuthUser | undefined => {
  return userProfileCache.get(userId);
};

/**
 * Store a user in the cache
 */
export const cacheUser = (userId: string, userData: AuthUser): void => {
  userProfileCache.set(userId, userData);
};

/**
 * Check if a user exists in the cache
 */
export const hasUserInCache = (userId: string): boolean => {
  return userProfileCache.has(userId);
};

/**
 * Clear the user profile cache (useful when logging out)
 */
export const clearUserProfileCache = (): void => {
  userProfileCache.clear();
};
