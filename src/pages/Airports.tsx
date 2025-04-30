
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

  return (
    <div className="space-y-6">
      <AirportsHeader 
        airportCount={sampleAirports.length} 
        totalMeetingPoints={totalMeetingPoints} 
      />
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <AirportFilters 
              onFilterChange={setFilters} 
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
