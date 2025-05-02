
import { useState } from "react";
import { toast } from "sonner";
import { ApiCategory, ApiKeyState } from "../models/apiSettings";

export function useApiSettings(apiCategories: ApiCategory[]) {
  // Initialize API keys state
  const [apiKeysState, setApiKeysState] = useState<Record<string, Record<string, ApiKeyState>>>(() => {
    const initialState: Record<string, Record<string, ApiKeyState>> = {};
    
    apiCategories.forEach(category => {
      initialState[category.name] = {};
      
      category.apis.forEach(api => {
        Object.keys(api.keys).forEach(keyName => {
          initialState[category.name][keyName] = {
            value: "",
            enabled: false,
            status: "disconnected"
          };
        });
      });
    });
    
    return initialState;
  });

  // For search functionality
  const [searchQuery, setSearchQuery] = useState("");

  // Handle API enable/disable toggle
  const handleApiToggle = (category: string, apiTitle: string, enabled: boolean) => {
    const updatedState = { ...apiKeysState };
    
    // Find all keys related to this API and update their enabled state
    apiCategories.find(c => c.name === category)?.apis.forEach(api => {
      if (api.title === apiTitle) {
        Object.keys(api.keys).forEach(keyName => {
          if (updatedState[category][keyName]) {
            updatedState[category][keyName].enabled = enabled;
            // Set status to pending when enabled, disconnected when disabled
            updatedState[category][keyName].status = enabled ? "pending" : "disconnected";
          }
        });
      }
    });
    
    setApiKeysState(updatedState);
    
    toast(`${apiTitle} ${enabled ? "enabled" : "disabled"}`, {
      description: enabled 
        ? "API integration has been enabled. Please configure your API keys." 
        : "API integration has been disabled.",
    });
  };

  // Handle API key input changes
  const handleApiKeyChange = (category: string, keyName: string, value: string) => {
    setApiKeysState(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [keyName]: {
          ...prev[category][keyName],
          value: value,
          // Reset status to pending if the value is changed
          status: value ? "pending" : "disconnected"
        }
      }
    }));
  };

  // Test API connection
  const testApiConnection = (category: string, apiTitle: string) => {
    const updatedState = { ...apiKeysState };
    let allKeysProvided = true;
    let keysToTest: string[] = [];
    
    // Find all keys for this API
    apiCategories.find(c => c.name === category)?.apis.forEach(api => {
      if (api.title === apiTitle) {
        Object.keys(api.keys).forEach(keyName => {
          keysToTest.push(keyName);
          if (!updatedState[category][keyName].value) {
            allKeysProvided = false;
          }
        });
      }
    });
    
    if (!allKeysProvided) {
      toast("Missing API Keys", {
        description: "Please provide all required API keys before testing the connection."
      });
      return;
    }
    
    // Simulate API connection test
    toast("Testing API Connection", {
      description: `Testing connection to ${apiTitle}...`
    });
    
    // Simulate connection test with timeout
    setTimeout(() => {
      // For demo: randomly succeed or fail (80% success rate)
      const success = Math.random() > 0.2;
      
      keysToTest.forEach(keyName => {
        updatedState[category][keyName].status = success ? "connected" : "error";
        updatedState[category][keyName].lastTested = new Date().toISOString();
      });
      
      setApiKeysState(updatedState);
      
      if (success) {
        toast("Connection Successful", {
          description: `Successfully connected to ${apiTitle}.`
        });
      } else {
        toast("Connection Failed", {
          description: `Failed to connect to ${apiTitle}. Please check your API keys.`
        });
      }
    }, 1500);
  };

  // Helper function to get all keys for a specific API
  const getKeysForApi = (category: string, apiTitle: string): string[] => {
    const keys: string[] = [];
    apiCategories.find(c => c.name === category)?.apis.forEach(api => {
      if (api.title === apiTitle) {
        Object.keys(api.keys).forEach(keyName => {
          keys.push(keyName);
        });
      }
    });
    return keys;
  };

  // Save API keys
  const handleSaveApiKeys = () => {
    // Here you would typically save the API keys to your backend
    console.log("Saving API keys:", apiKeysState);
    toast.success("API settings saved successfully!");
  };

  // Reset to default
  const handleResetApiKeys = () => {
    const resetState: Record<string, Record<string, ApiKeyState>> = {};
    
    apiCategories.forEach(category => {
      resetState[category.name] = {};
      
      category.apis.forEach(api => {
        Object.keys(api.keys).forEach(keyName => {
          resetState[category.name][keyName] = {
            value: "",
            enabled: false,
            status: "disconnected"
          };
        });
      });
    });
    
    setApiKeysState(resetState);
    toast.success("API keys reset to default");
  };

  return {
    apiKeysState,
    searchQuery,
    setSearchQuery,
    handleApiToggle,
    handleApiKeyChange,
    testApiConnection,
    getKeysForApi,
    handleSaveApiKeys,
    handleResetApiKeys
  };
}
