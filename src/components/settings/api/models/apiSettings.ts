
/**
 * API Settings type definitions
 */

export interface ApiKeyState {
  value: string;
  enabled: boolean;
  status: "connected" | "disconnected" | "error" | "pending";
  lastTested?: string;
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
    }
  };
}
