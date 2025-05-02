
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ApiKeyFieldProps {
  keyName: string;
  keyConfig: {
    label: string;
    placeholder: string;
    info?: string;
    sensitive?: boolean;
  };
  value: string;
  onChange: (value: string) => void;
  lastTested?: string;
  disabled?: boolean;
}

export function ApiKeyField({
  keyName,
  keyConfig,
  value,
  onChange,
  lastTested,
  disabled = false
}: ApiKeyFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={keyName} className="flex items-center gap-1">
          {keyConfig.label}
          {keyConfig.info && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{keyConfig.info}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Label>
        {lastTested && (
          <span className="text-xs text-muted-foreground">
            Last tested: {new Date(lastTested).toLocaleString()}
          </span>
        )}
      </div>
      <Input 
        id={keyName} 
        type={keyConfig.sensitive ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={keyConfig.placeholder}
        disabled={disabled}
      />
    </div>
  );
}
