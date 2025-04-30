
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Airport } from "@/types/airport";
import { getMeetingPointsByAirport } from "@/data/sampleMeetingPoints";
import { useEffect, useState } from "react";

interface AirportsTableProps {
  airports: Airport[];
  filters: {
    search: string;
    country: string;
  };
}

export function AirportsTable({ airports, filters }: AirportsTableProps) {
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>(airports);

  useEffect(() => {
    let result = airports;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (airport) =>
          airport.name.toLowerCase().includes(searchLower) ||
          airport.code.toLowerCase().includes(searchLower) ||
          airport.city.toLowerCase().includes(searchLower)
      );
    }

    if (filters.country) {
      result = result.filter((airport) => airport.country === filters.country);
    }

    setFilteredAirports(result);
  }, [airports, filters]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Airport Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>City / Country</TableHead>
            <TableHead className="text-center">Meeting Points</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAirports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No airports found
              </TableCell>
            </TableRow>
          ) : (
            filteredAirports.map((airport) => {
              const meetingPoints = getMeetingPointsByAirport(airport.id);
              return (
                <TableRow key={airport.id}>
                  <TableCell className="font-medium">{airport.name}</TableCell>
                  <TableCell>{airport.code}</TableCell>
                  <TableCell>
                    {airport.city}, {airport.country}
                  </TableCell>
                  <TableCell className="text-center">{meetingPoints.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={`/airports/${airport.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        asChild
                      >
                        <Link to={`/airports/meeting-points/new?airportId=${airport.id}`}>
                          Add Meeting Point
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
