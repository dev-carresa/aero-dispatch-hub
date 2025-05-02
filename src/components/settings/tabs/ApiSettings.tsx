
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { ApiSearchBar } from "../api/components/ApiSearchBar";
import { ApiCategoryTab } from "../api/components/ApiCategoryTab";
import { ApiDocumentation } from "../api/components/ApiDocumentation";
import { useApiSettings } from "../api/hooks/useApiSettings";
import { apiCategories } from "../api/data/apiCategories";

export function ApiSettings() {
  const {
    apiKeysState,
    searchQuery,
    setSearchQuery,
    handleApiToggle,
    handleApiKeyChange,
    validateApiKey,
    testApiConnection,
    handleSaveApiKeys,
    handleResetApiKeys,
    formState
  } = useApiSettings(apiCategories);

  // Filter API categories based on search query
  const filteredCategories = searchQuery.trim() === ""
    ? apiCategories
    : apiCategories.map(category => ({
        ...category,
        apis: category.apis.filter(api => 
          api.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          api.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.apis.length > 0);

  const [activeTab, setActiveTab] = useState(filteredCategories[0]?.name || "");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">API Integrations</h2>
          <p className="text-muted-foreground">
            Configure your API keys and external service connections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ApiSearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <Alert>
          <AlertDescription>
            No API integrations found matching your search criteria. Please try a different search term.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs 
          value={activeTab || filteredCategories[0]?.name} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            {filteredCategories.map((category) => (
              <TabsTrigger key={category.name} value={category.name} className="capitalize">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {filteredCategories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="animate-fade-in">
              <ApiCategoryTab 
                category={category}
                apiKeysState={apiKeysState}
                onApiToggle={handleApiToggle}
                onApiKeyChange={handleApiKeyChange}
                onApiKeyBlur={validateApiKey}
                onTestConnection={testApiConnection}
                isSubmitting={formState.isSubmitting}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      <ApiDocumentation />

      {formState.submitError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{formState.submitError}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={handleResetApiKeys}
          disabled={formState.isSubmitting}
        >
          Reset to Default
        </Button>
        <Button 
          onClick={handleSaveApiKeys} 
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save API Settings"
          )}
        </Button>
      </div>
    </div>
  );
}
