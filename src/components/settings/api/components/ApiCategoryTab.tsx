
import { ApiCard } from "./ApiCard";
import { ApiCategory, ApiKeyState } from "../models/apiSettings";

interface ApiCategoryTabProps {
  category: ApiCategory;
  apiKeysState: Record<string, Record<string, ApiKeyState>>;
  onApiToggle: (categoryName: string, apiTitle: string, enabled: boolean) => void;
  onApiKeyChange: (categoryName: string, keyName: string, value: string) => void;
  onTestConnection: (categoryName: string, apiTitle: string) => void;
}

export function ApiCategoryTab({
  category,
  apiKeysState,
  onApiToggle,
  onApiKeyChange,
  onTestConnection
}: ApiCategoryTabProps) {
  return (
    <div className="grid gap-6">
      {category.apis.map((api) => (
        <ApiCard
          key={api.title}
          api={api}
          category={category.name}
          apiKeysState={apiKeysState[category.name] || {}}
          onApiToggle={(enabled) => onApiToggle(category.name, api.title, enabled)}
          onApiKeyChange={(keyName, value) => onApiKeyChange(category.name, keyName, value)}
          onTestConnection={() => onTestConnection(category.name, api.title)}
        />
      ))}
    </div>
  );
}
