import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ApiCategory, ApiFormState, ApiKeyState } from "../models/apiSettings";
import { useAuth } from "@/context/AuthContext";

export function useApiSettings(apiCategories: ApiCategory[]) {
  // State for API keys
  const [apiKeysState, setApiKeysState] = useState<Record<string, Record<string, ApiKeyState>>>({});
  
  // For search functionality
  const [searchQuery, setSearchQuery] = useState("");
  
  // Loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);
  
  // Form submission state
  const [formState, setFormState] = useState<ApiFormState>({
    isSubmitting: false,
  });
  
  // Get the current user
  const { user, isAuthenticated } = useAuth();

  // Load API integrations from Supabase on component mount
  useEffect(() => {
    const fetchApiIntegrations = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('api_integrations')
          .select('*')
          .order('category');

        if (error) {
          console.error("Error fetching API integrations:", error);
          toast.error("Impossible de charger les intégrations API");
          setIsLoading(false);
          return;
        }

        // Transform data from database format to our state format
        const stateFromDb: Record<string, Record<string, ApiKeyState>> = {};
        
        if (data && data.length > 0) {
          data.forEach(integration => {
            if (!stateFromDb[integration.category]) {
              stateFromDb[integration.category] = {};
            }
            
            // Ensure status is one of the valid enum values
            const status = integration.status as "connected" | "disconnected" | "error" | "pending";
            
            stateFromDb[integration.category][integration.key_name] = {
              value: integration.key_value || "",
              enabled: integration.enabled,
              status: status,
              lastTested: integration.last_tested,
              error: integration.error
            };
          });
          
          setApiKeysState(stateFromDb);
        } else {
          // Initialize with empty state if no data
          initializeEmptyState();
        }
      } catch (err) {
        console.error("Error in fetching API integrations:", err);
        toast.error("Une erreur s'est produite lors du chargement des intégrations API");
        // Initialize with empty state on error
        initializeEmptyState();
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiIntegrations();
  }, [isAuthenticated, user]);

  // Initialize empty state based on API categories
  const initializeEmptyState = () => {
    const initialState: Record<string, Record<string, ApiKeyState>> = {};
    
    apiCategories.forEach(category => {
      initialState[category.name] = {};
      
      category.apis.forEach(api => {
        Object.keys(api.keys).forEach(keyName => {
          initialState[category.name][keyName] = {
            value: "",
            enabled: false, // This is initializing all API keys as disabled by default
            status: "disconnected"
          };
        });
      });
    });
    
    setApiKeysState(initialState);
  };

  // Save a single API key to database
  const saveApiKeyToDb = async (
    category: string,
    apiTitle: string,
    keyName: string,
    keyState: ApiKeyState
  ) => {
    if (!isAuthenticated || !user) {
      toast.error("Vous devez être connecté pour enregistrer des clés API");
      return false;
    }

    try {
      // First check if this key exists already
      const { data: existingKeys } = await supabase
        .from('api_integrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', category)
        .eq('key_name', keyName)
        .maybeSingle();

      if (existingKeys) {
        // Update existing key
        const { error } = await supabase
          .from('api_integrations')
          .update({
            key_value: keyState.value,
            enabled: keyState.enabled,
            status: keyState.status,
            last_tested: keyState.lastTested,
            error: keyState.error,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingKeys.id);

        if (error) {
          console.error("Error updating API key:", error);
          return false;
        }
      } else {
        // Insert new key
        const { error } = await supabase
          .from('api_integrations')
          .insert({
            user_id: user.id,
            category,
            api_title: apiTitle,
            key_name: keyName,
            key_value: keyState.value,
            enabled: keyState.enabled,
            status: keyState.status,
            last_tested: keyState.lastTested,
            error: keyState.error
          });

        if (error) {
          console.error("Error inserting API key:", error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error saving API key to database:", error);
      return false;
    }
  };

  // Handle API enable/disable toggle
  const handleApiToggle = async (category: string, apiTitle: string, enabled: boolean) => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour activer/désactiver des API");
      return;
    }
    
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
            
            // Save changes to database
            saveApiKeyToDb(category, apiTitle, keyName, updatedState[category][keyName]);
          }
        });
      }
    });
    
    setApiKeysState(updatedState);
    
    toast(enabled ? "API Activée" : "API Désactivée", {
      description: enabled 
        ? "L'intégration API a été activée. Veuillez configurer vos clés API." 
        : "L'intégration API a été désactivée.",
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
    
    // Find the API title and key configuration
    let apiTitle = "";
    let keyConfig;
    apiCategories.forEach(c => {
      if (c.name === category) {
        c.apis.forEach(api => {
          const apiKeyConfig = api.keys[keyName];
          if (apiKeyConfig) {
            keyConfig = apiKeyConfig;
            apiTitle = api.title;
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
      updatedState[category][keyName].error = "Ce champ est obligatoire";
      setApiKeysState(updatedState);
      
      // Save error state to database
      if (isAuthenticated && apiTitle) {
        saveApiKeyToDb(category, apiTitle, keyName, updatedState[category][keyName]);
      }
      return;
    }
    
    // Validate against regex pattern if provided and there's a value
    if (keyConfig?.validation && keyValue && !keyConfig.validation.test(keyValue)) {
      updatedState[category][keyName].error = "Format invalide";
      setApiKeysState(updatedState);
      
      // Save error state to database
      if (isAuthenticated && apiTitle) {
        saveApiKeyToDb(category, apiTitle, keyName, updatedState[category][keyName]);
      }
      return;
    }
    
    // Clear error if validation passed
    if (updatedState[category][keyName].error) {
      updatedState[category][keyName].error = undefined;
      setApiKeysState(updatedState);
      
      // Save updated state to database
      if (isAuthenticated && apiTitle) {
        saveApiKeyToDb(category, apiTitle, keyName, updatedState[category][keyName]);
      }
    }
  };

  // Test API connection
  const testApiConnection = async (category: string, apiTitle: string) => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour tester les connexions API");
      return;
    }
    
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
      toast.error("Validation échouée", {
        description: "Veuillez corriger les erreurs avant de tester la connexion."
      });
      return;
    }
    
    // Simulate API connection test
    toast("Test de connexion API en cours", {
      description: `Test de connexion à ${apiTitle}...`
    });
    
    // Simulate connection test with timeout
    setTimeout(async () => {
      // For demo: randomly succeed or fail (80% success rate)
      const success = Math.random() > 0.2;
      
      // Update state
      for (const keyName of keysToTest) {
        updatedState[category][keyName].status = success ? "connected" : "error";
        updatedState[category][keyName].lastTested = new Date().toISOString();
        
        // Save test result to database
        await saveApiKeyToDb(category, apiTitle, keyName, updatedState[category][keyName]);
      }
      
      setApiKeysState(updatedState);
      
      if (success) {
        toast.success("Connexion réussie", {
          description: `Connexion réussie à ${apiTitle}.`
        });
      } else {
        toast.error("Échec de la connexion", {
          description: `Échec de la connexion à ${apiTitle}. Veuillez vérifier vos clés API.`
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
            updatedState[category.name][keyName].error = "Ce champ est obligatoire";
            isValid = false;
          } else if (keyEnabled && keyConfig.validation && keyValue && !keyConfig.validation.test(keyValue)) {
            updatedState[category.name][keyName].error = "Format invalide";
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
    if (!isAuthenticated || !user) {
      toast.error("Vous devez être connecté pour enregistrer les configurations API");
      return;
    }

    // Validate all API keys first
    const isValid = validateAllApiKeys();
    
    if (!isValid) {
      toast.error("Validation échouée", {
        description: "Veuillez corriger les erreurs avant d'enregistrer."
      });
      return;
    }
    
    setFormState({ isSubmitting: true });
    
    try {
      // Save all API keys to database
      const savePromises: Promise<boolean>[] = [];
      
      apiCategories.forEach(category => {
        category.apis.forEach(api => {
          Object.keys(api.keys).forEach(keyName => {
            if (apiKeysState[category.name] && apiKeysState[category.name][keyName]) {
              savePromises.push(
                saveApiKeyToDb(
                  category.name,
                  api.title,
                  keyName,
                  apiKeysState[category.name][keyName]
                )
              );
            }
          });
        });
      });
      
      // Wait for all save operations to complete
      const results = await Promise.all(savePromises);
      
      // Check if any save operations failed
      if (results.some(result => !result)) {
        throw new Error("Certaines configurations n'ont pas pu être enregistrées");
      }
      
      setFormState({
        isSubmitting: false,
        submitSuccess: true
      });
      
      toast.success("Configurations API enregistrées avec succès!");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des clés API:", error);
      setFormState({
        isSubmitting: false,
        submitError: "Échec de l'enregistrement des configurations API. Veuillez réessayer."
      });
      
      toast.error("Échec de l'enregistrement", {
        description: "Échec de l'enregistrement des configurations API. Veuillez réessayer."
      });
    }
  };

  // Reset to default
  const handleResetApiKeys = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Vous devez être connecté pour réinitialiser les configurations API");
      return;
    }
    
    setFormState({ isSubmitting: true });
    
    try {
      // Delete all API integrations for this user
      const { error } = await supabase
        .from('api_integrations')
        .delete()
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Reset state
      initializeEmptyState();
      
      setFormState({ isSubmitting: false });
      toast.success("Configurations API réinitialisées");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des clés API:", error);
      
      setFormState({
        isSubmitting: false,
        submitError: "Échec de la réinitialisation des configurations API. Veuillez réessayer."
      });
      
      toast.error("Échec de la réinitialisation", {
        description: "Échec de la réinitialisation des configurations API. Veuillez réessayer."
      });
    }
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
    formState,
    isLoading
  };
}
