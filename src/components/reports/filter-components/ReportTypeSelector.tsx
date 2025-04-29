
import { Label } from "@/components/ui/label";
import { ReportType } from "@/types/report";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface ReportTypeSelectorProps {
  selectedType: ReportType;
  onTypeChange: (type: ReportType) => void;
}

export function ReportTypeSelector({
  selectedType,
  onTypeChange
}: ReportTypeSelectorProps) {
  return (
    <div>
      <Label className="text-base">Report Type</Label>
      <Tabs 
        value={selectedType} 
        onValueChange={(value) => onTypeChange(value as ReportType)}
        className="mt-2"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="driver">Driver</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
