
/**
 * API Settings type definitions
 */

export interface ApiKeyState {
  value: string;
  enabled: boolean;
  status: "connected" | "disconnected" | "error" | "pending";
  lastTested?: string;
  error?: string; // Added for validation errors
}

export interface ApiCategory {
  name: string;
  description: string;
  apis: ApiDefinition[];
}

export interface ApiDefinition {
  title: string;
  description: string;
  keys: {
    [key: string]: {
      label: string;
      placeholder: string;
      info?: string;
      sensitive?: boolean;
      required?: boolean; // Added to mark keys as required
      validation?: RegExp; // Added for regex validation
    }
  };
}

// Form submission state
export interface ApiFormState {
  isSubmitting: boolean;
  submitError?: string;
  submitSuccess?: boolean;
}
