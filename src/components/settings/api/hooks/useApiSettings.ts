
import { useState } from "react";
import { toast } from "sonner";
import { ApiCategory, ApiFormState, ApiKeyState } from "../models/apiSettings";

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
    
    // Try to load from localStorage if available
    try {
      const savedState = localStorage.getItem("apiKeysState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        return parsedState;
      }
    } catch (error) {
      console.error("Failed to load API keys from localStorage:", error);
    }
    
    return initialState;
  });

  // For search functionality
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form submission state
  const [formState, setFormState] = useState<ApiFormState>({
    isSubmitting: false,
  });

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
            // Clear any errors when toggling
            updatedState[category][keyName].error = undefined;
          }
        });
      }
    });
    
    setApiKeysState(updatedState);
    
    toast(enabled ? "API Enabled" : "API Disabled", {
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
          status: value ? "pending" : "disconnected",
          // Clear any errors when the value changes
          error: undefined
        }
      }
    }));
  };

  // Validate a single API key on blur
  const validateApiKey = (category: string, keyName: string) => {
    const updatedState = { ...apiKeysState };
    const keyValue = updatedState[category][keyName]?.value || "";
    const keyEnabled = updatedState[category][keyName]?.enabled || false;
    
    // Find the key configuration
    let keyConfig;
    apiCategories.forEach(c => {
      if (c.name === category) {
        c.apis.forEach(api => {
          const apiKeyConfig = api.keys[keyName];
          if (apiKeyConfig) {
            keyConfig = apiKeyConfig;
          }
        });
      }
    });
    
    // Skip validation if not enabled
    if (!keyEnabled) {
      return;
    }
    
    // Validate required fields
    if (keyConfig?.required && (!keyValue || keyValue.trim() === "")) {
      updatedState[category][keyName].error = "This field is required";
      setApiKeysState(updatedState);
      return;
    }
    
    // Validate against regex pattern if provided and there's a value
    if (keyConfig?.validation && keyValue && !keyConfig.validation.test(keyValue)) {
      updatedState[category][keyName].error = "Invalid format";
      setApiKeysState(updatedState);
      return;
    }
    
    // Clear error if validation passed
    if (updatedState[category][keyName].error) {
      updatedState[category][keyName].error = undefined;
      setApiKeysState(updatedState);
    }
  };

  // Test API connection
  const testApiConnection = (category: string, apiTitle: string) => {
    // First validate all keys for this API
    const updatedState = { ...apiKeysState };
    let allKeysProvided = true;
    let keysToTest: string[] = [];
    
    // Find all keys for this API
    apiCategories.find(c => c.name === category)?.apis.forEach(api => {
      if (api.title === apiTitle) {
        Object.entries(api.keys).forEach(([keyName, keyConfig]) => {
          keysToTest.push(keyName);
          validateApiKey(category, keyName);
          
          // Check if required keys are missing
          if (keyConfig.required && (!updatedState[category][keyName].value || updatedState[category][keyName].value.trim() === "")) {
            allKeysProvided = false;
          }
        });
      }
    });
    
    // Don't proceed if validation failed
    const hasErrors = keysToTest.some(keyName => updatedState[category][keyName].error);
    if (hasErrors || !allKeysProvided) {
      toast.error("Validation Failed", {
        description: "Please correct the errors before testing the connection."
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
        toast.success("Connection Successful", {
          description: `Successfully connected to ${apiTitle}.`
        });
      } else {
        toast.error("Connection Failed", {
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

  // Validate all API keys
  const validateAllApiKeys = (): boolean => {
    let isValid = true;
    const updatedState = { ...apiKeysState };
    
    apiCategories.forEach(category => {
      category.apis.forEach(api => {
        Object.entries(api.keys).forEach(([keyName, keyConfig]) => {
          // Skip validation if this API is not enabled
          const isEnabled = Object.values(updatedState[category.name]).some(state => state.enabled);
          if (!isEnabled) return;
          
          const keyValue = updatedState[category.name][keyName]?.value || "";
          const keyEnabled = updatedState[category.name][keyName]?.enabled || false;
          
          if (keyEnabled && keyConfig.required && (!keyValue || keyValue.trim() === "")) {
            updatedState[category.name][keyName].error = "This field is required";
            isValid = false;
          } else if (keyEnabled && keyConfig.validation && keyValue && !keyConfig.validation.test(keyValue)) {
            updatedState[category.name][keyName].error = "Invalid format";
            isValid = false;
          } else if (updatedState[category.name][keyName].error) {
            // Clear error if validation passed
            updatedState[category.name][keyName].error = undefined;
          }
        });
      });
    });
    
    setApiKeysState(updatedState);
    return isValid;
  };

  // Save API keys
  const handleSaveApiKeys = async () => {
    // Validate all API keys first
    const isValid = validateAllApiKeys();
    
    if (!isValid) {
      toast.error("Validation Failed", {
        description: "Please correct the errors before saving."
      });
      return;
    }
    
    setFormState({ isSubmitting: true });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send this to your backend
      console.log("Saving API keys:", apiKeysState);
      
      // Save to localStorage for demo purposes
      localStorage.setItem("apiKeysState", JSON.stringify(apiKeysState));
      
      setFormState({
        isSubmitting: false,
        submitSuccess: true
      });
      
      toast.success("API settings saved successfully!");
    } catch (error) {
      console.error("Error saving API keys:", error);
      setFormState({
        isSubmitting: false,
        submitError: "Failed to save API settings. Please try again."
      });
      
      toast.error("Save Failed", {
        description: "Failed to save API settings. Please try again."
      });
    }
  };

  // Reset to default
  const handleResetApiKeys = () => {
    // Clear localStorage
    localStorage.removeItem("apiKeysState");
    
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
    setFormState({ isSubmitting: false });
    toast.success("API keys reset to default");
  };

  return {
    apiKeysState,
    searchQuery,
    setSearchQuery,
    handleApiToggle,
    handleApiKeyChange,
    validateApiKey,
    testApiConnection,
    getKeysForApi,
    handleSaveApiKeys,
    handleResetApiKeys,
    formState
  };
}
