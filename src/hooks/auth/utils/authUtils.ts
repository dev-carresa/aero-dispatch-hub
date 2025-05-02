
// Debounce utility to prevent multiple rapid login attempts
export const debounce = <F extends (...args: any[]) => Promise<any>>(func: F, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<F>): ReturnType<F> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timeoutId = null;
        func(...args)
          .then(resolve)
          .catch(reject);
      }, delay);
    }) as ReturnType<F>;
  };
};

// Constants for authentication
export const AUTH_CONSTANTS = {
  MIN_TIME_BETWEEN_ATTEMPTS: 800,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_ATTEMPTS_RESET_TIME: 30000,
  AUTH_ACTION_RESET_DELAY: 500,
  NAVIGATION_DELAY: 100
};
