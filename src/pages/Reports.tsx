
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, PlusSquare, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Reports = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and manage reports for your transportation business
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <PlusSquare className="h-5 w-5 text-primary" />
              Generate New Report
            </CardTitle>
            <CardDescription>
              Create custom reports with flexible filters and data options
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground">
              Select date ranges, booking status, and include data for drivers,
              customers, fleets, and vehicles to generate comprehensive reports.
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center">• Choose custom date ranges</li>
              <li className="flex items-center">• Filter by booking status</li>
              <li className="flex items-center">• Include specific data points</li>
              <li className="flex items-center">• Export in multiple formats</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full gap-2" 
              onClick={() => navigate("/reports/generate")}
            >
              <PlusSquare className="h-4 w-4" />
              Generate Report
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5 text-primary" />
              Saved Reports
            </CardTitle>
            <CardDescription>
              Access and manage your previously saved reports
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground">
              View, edit, export, and manage reports you've previously generated and saved.
              Quickly access reports in draft, final, or archived states.
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center">• Browse all saved reports</li>
              <li className="flex items-center">• Change report status</li>
              <li className="flex items-center">• Export in various formats</li>
              <li className="flex items-center">• Restore from trash</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full gap-2" 
              onClick={() => navigate("/reports/saved")}
            >
              <FileText className="h-4 w-4" />
              View Saved Reports
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-medium mb-2">Report Tips</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Make the most of your reporting capabilities with these helpful tips:
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <h4 className="font-medium">Regular Reports</h4>
            <p className="text-sm text-muted-foreground">
              Create monthly driver performance reports to track efficiency and identify top performers.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Data Exports</h4>
            <p className="text-sm text-muted-foreground">
              Export reports as CSV to easily import into your accounting or business intelligence software.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Custom Filters</h4>
            <p className="text-sm text-muted-foreground">
              Use detailed filters to analyze specific segments of your business operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
