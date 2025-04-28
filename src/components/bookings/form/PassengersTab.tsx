
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PassengersTabProps {
  onBack: () => void;
  onNext: () => void;
}

export function PassengersTab({ onBack, onNext }: PassengersTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Passenger Information</CardTitle>
        <CardDescription>Add all passenger details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="passengers">Number of Passengers</Label>
          <Input id="passengers" type="number" min="1" placeholder="1" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="luggage">Number of Luggage</Label>
          <Input id="luggage" type="number" min="0" placeholder="1" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="flight">Flight Number (if applicable)</Label>
          <Input id="flight" placeholder="e.g. LH123" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="special-instructions">Special Instructions</Label>
          <Textarea id="special-instructions" placeholder="Any special requirements..." />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Next</Button>
      </CardFooter>
    </Card>
  );
}
