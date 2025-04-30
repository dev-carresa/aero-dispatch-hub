
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiKeyDisplayProps {
  apiKey: string;
  label: string;
  className?: string;
}

export function ApiKeyDisplay({ apiKey, label, className }: ApiKeyDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maskKey = (key: string) => {
    if (!key) return '•••••••••••••••••••';
    return key.substring(0, 4) + '•••••••••••••••' + key.substring(key.length - 4);
  };

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center space-x-2">
        <div className="bg-muted/50 px-3 py-2 rounded-md flex-grow font-mono text-sm">
          {isVisible ? apiKey : maskKey(apiKey)}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVisibility}
          title={isVisible ? "Hide key" : "Show key"}
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          title="Copy to clipboard"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
