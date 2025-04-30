
import { useState, useEffect } from "react";
import { AirportsHeader } from "@/components/airports/AirportsHeader";
import { AirportFilters } from "@/components/airports/AirportFilters";
import { AirportsTable } from "@/components/airports/AirportsTable";
import { sampleAirports } from "@/data/sampleAirports";
import { sampleMeetingPoints } from "@/data/sampleMeetingPoints";
import { Card, CardContent } from "@/components/ui/card";

export default function Airports() {
  const [filters, setFilters] = useState({ search: "", country: "" });
  const [countries, setCountries] = useState<string[]>([]);
  const totalMeetingPoints = sampleMeetingPoints.length;

  // Extract unique countries for filter dropdown
  useEffect(() => {
    const uniqueCountries = Array.from(
      new Set(sampleAirports.map((airport) => airport.country))
    );
    setCountries(uniqueCountries);
  }, []);

  const handleFilterChange = (newFilters: { search: string; country: string }) => {
    // If the country filter is "all", set it to an empty string for filtering logic
    const processedFilters = {
      ...newFilters,
      country: newFilters.country === "all" ? "" : newFilters.country
    };
    setFilters(processedFilters);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AirportsHeader 
        airportCount={sampleAirports.length} 
        totalMeetingPoints={totalMeetingPoints} 
      />
      
      <Card className="shadow-sm hover:shadow transition-shadow duration-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <AirportFilters 
              onFilterChange={handleFilterChange} 
              countries={countries} 
            />
            <AirportsTable 
              airports={sampleAirports} 
              filters={filters} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
