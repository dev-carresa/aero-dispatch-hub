
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FetchControlsFormProps {
  onFetch: () => Promise<void>;
  isLoading: boolean;
}

export function FetchControlsForm({ onFetch, isLoading }: FetchControlsFormProps) {
  const [bookingStatus, setBookingStatus] = useState<string>("active");
  
  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    await onFetch();
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleFetch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Booking Status</Label>
            <Select 
              value={bookingStatus} 
              onValueChange={setBookingStatus} 
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Fetch Bookings
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
