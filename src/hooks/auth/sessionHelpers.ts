
import { 
  hasStoredSession as checkStoredSession 
} from '@/services/sessionStorageService';

/**
 * Helper function to check if local storage has auth token
 */
export const hasStoredSession = (): boolean => {
  return checkStoredSession();
};
