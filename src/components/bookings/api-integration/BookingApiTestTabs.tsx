
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfigureTab } from "./tabs/ConfigureTab";
import { TestTab } from "./tabs/TestTab";
import { ImportTab } from "./tabs/ImportTab";

interface BookingApiTestTabsProps {
  onImportComplete?: (stats: {
    saved: number;
    errors: number;
    duplicates: number;
  }) => void;
}

export function BookingApiTestTabs({ onImportComplete }: BookingApiTestTabsProps) {
  const [activeTab, setActiveTab] = useState("configure");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error" | "loading">("disconnected");

  const handleConfigureSuccess = () => {
    setActiveTab("test");
  };

  const handleTestSuccess = () => {
    setActiveTab("import");
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
        <TabsTrigger value="configure">Configure</TabsTrigger>
        <TabsTrigger value="test">Test</TabsTrigger>
        <TabsTrigger value="import">Import</TabsTrigger>
      </TabsList>
      
      <TabsContent value="configure">
        <ConfigureTab 
          onConfigured={handleConfigureSuccess}
          connectionStatus={connectionStatus}
          onConnectionChange={setConnectionStatus} 
        />
      </TabsContent>
      
      <TabsContent value="test">
        <TestTab onSuccess={handleTestSuccess} />
      </TabsContent>
      
      <TabsContent value="import">
        <ImportTab onImportComplete={onImportComplete} />
      </TabsContent>
    </Tabs>
  );
}
