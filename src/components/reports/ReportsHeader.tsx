
import { Button } from "@/components/ui/button";
import { FileText, PlusSquare, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReportsHeaderProps {
  title: string;
  description: string;
  showGenerateButton?: boolean;
  showSavedButton?: boolean;
}

export function ReportsHeader({ 
  title, 
  description, 
  showGenerateButton = true, 
  showSavedButton = true 
}: ReportsHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {showGenerateButton && (
          <Button 
            variant="outline" 
            onClick={() => navigate("/reports/generate")}
            className="gap-2"
          >
            <PlusSquare className="h-4 w-4" />
            Generate New
          </Button>
        )}
        {showSavedButton && (
          <Button 
            variant={showGenerateButton ? "default" : "outline"}
            onClick={() => navigate("/reports/saved")}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Saved Reports
          </Button>
        )}
      </div>
    </div>
  );
}
