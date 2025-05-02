
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    testApiConnection,
    handleSaveApiKeys,
    handleResetApiKeys
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

      <Tabs defaultValue="payment" className="w-full">
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
              onTestConnection={testApiConnection}
            />
          </TabsContent>
        ))}
      </Tabs>

      <ApiDocumentation />

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={handleResetApiKeys}>Reset to Default</Button>
        <Button onClick={handleSaveApiKeys}>Save API Settings</Button>
      </div>
    </div>
  );
}
