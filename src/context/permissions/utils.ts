
import { useRef, MutableRefObject } from 'react';

// Clean up function to clear timeouts
export const cleanupTimeouts = (timeoutRef: MutableRefObject<NodeJS.Timeout | null>) => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
};
